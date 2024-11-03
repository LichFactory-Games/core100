console.log("core100.js is loading");

// Import your modules
import { CORE100_SCHEMA, SKILL_AREAS, DIFFICULTIES, ATTRIBUTES } from "./schema.js";
import { preloadHandlebarsTemplates } from "./helpers/templates.js";
import { Core100Actor } from "./actor/actor.js";
import { Core100ActorSheet } from "./actor/actor-sheet.js";
import { Core100Item } from "./item/item.js";
import { Core100ItemSheet } from "./item/item-sheet.js";
import { registerEnrichTest } from "./helpers/enrichers.mjs";

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
function registerHandlebarsHelpers() {
  // Calculate Success Number
  Handlebars.registerHelper("calculateSuccessNumber", function(attribute, difficulty) {
    const mod = difficulty === "Average" ? 10 : 5;
    return attribute + mod;
  });
  // Format attribute labels
  Handlebars.registerHelper("formatAttribute", function(attr) {
    return attr.charAt(0).toUpperCase() + attr.slice(1);
  });
  // Register Handlebars helpers
  Handlebars.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
  Handlebars.registerHelper('upperCase', function(str) {
    return str.toUpperCase();
  });
  console.log("Core 100 | Register Handlebars");
}

/* -------------------------------------------- */
/*  System Settings Registration                 */
/* -------------------------------------------- */
function registerSettings() {
  game.settings.register("core100", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });
}

/* -------------------------------------------- */
/*  Custom Roll class extending Roll            */
/* -------------------------------------------- */

class TargetRoll extends Roll {
  constructor(formula, target, data, options) {
    super(formula, data, options);
    this.target = target;
    console.log("core100 | TargetRoll constructed:", this);
  }

  static fromData(data) {
    console.log("core100 | TargetRoll fromData:", data);
    return new this(data.formula, data.target, data.data, data.options);
  }

  async evaluate(options = {}) {
    console.log("core100 | TargetRoll evaluate starting:", options);
    // Remove the async option
    await super.evaluate(options);
    this.outcome = game.core100.evaluateRollOutcome(this.total, this.target);
    console.log("core100 | TargetRoll evaluate complete:", this);
    return this;
  }

  toJSON() {
    const json = super.toJSON();
    json.target = this.target;
    console.log("core100 | TargetRoll toJSON:", json);
    return json;
  }

  async toMessage(messageData={}, {rollMode=null, create=true}={}) {
    console.log("core100 | TargetRoll toMessage starting");

    // Ensure roll is evaluated
    if (!this._evaluated) await this.evaluate();

    if (game.dice3d) {
      console.log("core100 | Showing Dice So Nice animation from toMessage");
      await game.dice3d.showForRoll(this, game.user, true);
    }

    messageData = foundry.utils.mergeObject({
      speaker: ChatMessage.getSpeaker(),
      flavor: messageData.flavor || null,
      flags: messageData.flags || {},
      rolls: [this],
      sound: CONFIG.sounds.dice
    }, messageData);

    messageData.content = `
      <div class="message-content">
        <h2>Target Check</h2>
        <p>Target: ${this.target}</p>
        <p>Roll: ${this.total}</p>
        <p>Outcome: <span style="${this.outcome.outcomeStyle}">${this.outcome.outcome}</span></p>
      </div>
    `;

    ChatMessage.applyRollMode(messageData, rollMode || game.settings.get('core', 'rollMode'));
    console.log("core100 | TargetRoll toMessage creating with data:", messageData);

    if (create) return ChatMessage.create(messageData);
    return messageData;
  }
}

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log("core100 | Initializing Core 100 System");

  // Global game functions
  game.core100 = {
    evaluateRollOutcome: function(rollResult, target) {
      const isDoubles = rollResult % 11 === 0;
      let outcome = "";
      let outcomeStyle = "color: black"; // Default style
      if (rollResult <= target) { // Success cases
        if (isDoubles) {
          outcome = "Ace";
          outcomeStyle = "color: goldenrod";
        } else if (rollResult <= Math.floor(target / 2)) {
          outcome = "Success";
          outcomeStyle = "color: green";
        } else {
          outcome = "Partial Success";
          outcomeStyle = "color: darkblue";
        }
      } else { // Failure cases
        if (isDoubles) {
          outcome = "Fumble";
          outcomeStyle = "color: red";
        } else if (rollResult <= Math.floor((100 - target) / 2) + target) {
          outcome = "Partial Failure";
          outcomeStyle = "color: brown";
        } else {
          outcome = "Failure";
          outcomeStyle = "color: crimson";
        }
      }
      return { outcome, outcomeStyle };
    },
    TargetRoll  // Make TargetRoll available globally
  };

  // Register custom roll command
  CONFIG.Dice.rolls.push(TargetRoll);

  // Define custom Document classes
  console.log("Defining document classes");
  // DEBUG
  CONFIG.debug.hooks = true;   // Shows hook firing events
  CONFIG.debug.roles = true;   // Shows permission checks
  CONFIG.Actor.documentClass = Core100Actor;
  CONFIG.Item.documentClass = Core100Item;
  CONFIG.CORE100 = {
    skillAreas: SKILL_AREAS,
    difficulties: DIFFICULTIES,
    attributes: ATTRIBUTES
  };

  // Register custom system data models
  CONFIG.Actor.DataModels = CORE100_SCHEMA.Actor || {};
  CONFIG.Item.DataModels = CORE100_SCHEMA.Item || {};

  // First unregister default sheets
  console.log("Unregistering default sheets");
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Register sheet application classes
  Actors.registerSheet("core100", Core100ActorSheet, { makeDefault: true });
  Items.registerSheet("core100", Core100ItemSheet, { makeDefault: true });

  // Register system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  // Register Handlebars Helpers
  registerHandlebarsHelpers();

  registerEnrichTest();

});

/* -------------------------------------------- */
/*  Chat Message & Roll Handlers                */
/* -------------------------------------------- */
// Register chat command for /troll
Hooks.on('chatMessage', (chatLog, message, chatData) => {
  if (message.startsWith('/troll')) {
    const [command, target, ...rest] = message.split(' ');
    if (!target || isNaN(target)) {
      ui.notifications.error("Usage: /troll <target> [comment]");
      return false;
    }

    // Create and evaluate the roll
    const roll = new TargetRoll('1d100', parseInt(target), {});

    console.log("core100 | Creating roll:", roll);

    // Use Promise chain with evaluate()
    roll.evaluate().then(async () => {
      console.log("core100 | Roll evaluated:", roll);

      if (game.dice3d) {
        console.log("core100 | Showing Dice So Nice animation");
        await game.dice3d.showForRoll(roll, game.user, true);
      }

      const chatData = {
        rolls: [roll],
        flavor: rest.join(' '),
        speaker: ChatMessage.getSpeaker(),
        content: `
          <div class="message-content">
            <h2>Target Check</h2>
            <p>Target: ${roll.target}</p>
            <p>Roll: ${roll.total}</p>
            <p>Outcome: <span style="${roll.outcome.outcomeStyle}">${roll.outcome.outcome}</span></p>
          </div>
        `,
        sound: CONFIG.sounds.dice
      };

      console.log("core100 | Creating chat message with data:", chatData);
      ChatMessage.applyRollMode(chatData, game.settings.get('core', 'rollMode'));
      await ChatMessage.create(chatData);
    });

    return false;
  }
});

/* -------------------------------------------- */
/*  Ready Hook (Debug Functions)                */
/* -------------------------------------------- */

Hooks.once('ready', () => {
  // Extend the existing game.core100 object with debug functionality
  game.core100.debug = {
    refreshSheets: async () => {
      for (const window of Object.values(ui.windows)) {
        if (window instanceof ActorSheet) {
          window._state = Application.RENDER_STATES.NONE;
          window.render(true);
        }
      }
    },
    forceUpdateSheets: async () => {
      for (const window of Object.values(ui.windows)) {
        if (window instanceof ActorSheet) {
          await window.actor.render(false);
          window._state = Application.RENDER_STATES.NONE;
          await window.render(true);
        }
      }
    }
  };

  // Add keyboard shortcut for quick refresh (Ctrl + R)
  $(document).on('keydown', async (event) => {
    if (event.ctrlKey && event.key === 'r') {
      event.preventDefault();
      await game.core100.debug.forceUpdateSheets();
    }
  });

  console.log("core100 | Debug helpers initialized");
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */
Hooks.on("canvasInit", function() {
  console.log("core100 | Canvas Init");
});

console.log("core100.js finished loading");
