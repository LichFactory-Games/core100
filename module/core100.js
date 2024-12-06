console.log("core100.js is loading");

// Import your modules
import { CORE100_SCHEMA, SKILL_AREAS, DIFFICULTIES, ATTRIBUTES } from "./schema.js";
import { preloadHandlebarsTemplates } from "./helpers/templates.js";
import { Core100Actor } from "./actor/actor.js";
import { Core100ActorSheet } from "./actor/actor-sheet.js";
import { Core100Item } from "./item/item.js";
import { Core100ItemSheet } from "./item/item-sheet.js";
import { registerSuccessRollEnricher } from "./helpers/enrichers.mjs";

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
  constructor(formula, target, skillName = '', data = {}, options = {}) {
    super(formula, data, options);
    this.target = target;
    this.skillName = skillName;
    console.log("core100 | TargetRoll constructed:", this);
  }

  static fromData(data) {
    // Make sure we pull skillName from the data when reconstructing
    const roll = new this(data.formula, data.target, data.skillName, data.data, data.options);
    roll._total = data.total;
    roll._evaluated = data._evaluated;
    roll.outcome = data.outcome;
    return roll;
  }

  toJSON() {
    const json = super.toJSON();
    json.target = this.target;
    json.skillName = this.skillName;  // Include skillName in serialized data
    if (this.outcome) json.outcome = this.outcome;
    console.log("core100 | TargetRoll toJSON:", json);
    return json;
  }

  async evaluate(options = {}) {
    console.log("core100 | TargetRoll evaluate starting:", options);
    await super.evaluate(options);
    this.outcome = game.core100.evaluateRollOutcome(this.total, this.target);
    console.log("core100 | TargetRoll evaluate complete:", this);
    return this;
  }

  async toMessage(messageData={}, {rollMode=null, create=true}={}) {
    console.log("core100 | TargetRoll toMessage starting");
    if (!this._evaluated) await this.evaluate();
    if (game.dice3d) {
      await game.dice3d.showForRoll(this, game.user, true);
    }
    messageData = foundry.utils.mergeObject({
      speaker: ChatMessage.getSpeaker(),
      flavor: null,
      flags: messageData.flags || {},
      rolls: [this],
      sound: CONFIG.sounds.dice
    }, messageData);

    // Create tooltip text based on whether it's an advantage roll or not
    const tooltipText = this.advantage ?
          `Rolls: ${this.terms[0].results.map(r => r.result).join(', ')} (taking ${this.total}) vs. SN ${this.target}` :
          `Roll: ${this.total} vs. SN ${this.target}`;

    messageData.content = `
  <div class="message-content">
    <h2 style="text-align: center;">${this.skillName ? `${this.skillName} Check` : 'Check'}</h2>
    ${this.advantage ? '<p style="text-align: center;"><em>Rolling with Advantage</em></p>' : ''}
    <p style="font-size: var(--font-size-20); font-weight: bold; text-align: center;">
      <span class="tooltip" data-tooltip="${tooltipText}" style="${this.outcome.outcomeStyle}">
        ${this.outcome.outcome}
      </span>
    </p>
  </div>
`;
    ChatMessage.applyRollMode(messageData, rollMode || game.settings.get('core', 'rollMode'));
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
        } else {
          outcome = "Success";
          outcomeStyle = "color: green";
        }
      } else { // Failure cases
        if (isDoubles) {
          outcome = "Fumble";
          outcomeStyle = "color: red";
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

  // Register Roll Enrichers
  registerSuccessRollEnricher();

});

/* -------------------------------------------- */
/*  Chat Message & Roll Handlers                */
/* -------------------------------------------- */
// Register chat command for /troll
// Register chat command for /troll
Hooks.on('chatMessage', (chatLog, message, chatData) => {
  if (message.startsWith('/troll')) {
    // Split the message into parts
    const args = message.split(' ');

    // Check if we have at least a target number
    if (args.length < 2) {
      ui.notifications.error("Usage: /troll <target> [name]");
      return false;
    }

    // Find the last number in the arguments
    const targetIndex = args.findIndex(arg => !isNaN(arg));
    if (targetIndex === -1) {
      ui.notifications.error("Usage: /troll <target> [name]");
      return false;
    }

    // Get target number
    const target = parseInt(args[targetIndex]);

    // Get name (if provided) - join all words before the target number
    const name = targetIndex > 1 ? args.slice(1, targetIndex).join(' ') : '';

    // Create and evaluate the roll using your standard TargetRoll
    const roll = new game.core100.TargetRoll('1d100', target, name);

    // Evaluate and create message
    roll.evaluate().then(async () => {
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker()
      });
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
