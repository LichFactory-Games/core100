console.log("core100.js is loading");

// Import your modules
import { CORE100_SCHEMA, SKILL_AREAS, DIFFICULTIES, ATTRIBUTES } from "./schema.js";
import { preloadHandlebarsTemplates } from "./helpers/templates.js";
import { Core100Actor } from "./actor/actor.js";
import { Core100ActorSheet } from "./actor/actor-sheet.js";
import { Core100Item } from "./item/item.js";
import { Core100ItemSheet } from "./item/item-sheet.js";

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
  // Custom Roll
  Handlebars.registerHelper('targetRoll', function(target, label = "Target Check") {
    return new Handlebars.SafeString(`${label} (${target}): [[/r 1d100 # vs ${target}]]`);
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
  }

  // Add static fromData method required for recreation
  static fromData(data) {
    return new this(data.formula, data.target, data.data, data.options);
  }

  /** @override */
  async evaluate(options = {}) {
    await super.evaluate(options);
    this.outcome = game.core100.evaluateRollOutcome(this.total, this.target);
    return this;
  }

  /** @override */
  toMessage(messageData = {}, options = {}) {
    // Add custom roll result styling to the message
    const outcome = this.outcome || { outcome: "No Target", outcomeStyle: "color: black" };

    // Format similar to your skill/trait rolls
    const messageContent = `
      <h2>Target Check</h2>
      <p>Target: ${this.target}</p>
      <p>Roll: ${this.total}</p>
      <p>Outcome: <span style="${outcome.outcomeStyle}">${outcome.outcome}</span></p>
    `;

    messageData.content = messageContent;
    return super.toMessage(messageData, options);
  }

  // Add toJSON method to properly serialize the roll
  toJSON() {
    const json = super.toJSON();
    json.target = this.target;
    return json;
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
});

/* -------------------------------------------- */
/*  Chat Message & Roll Handlers                */
/* -------------------------------------------- */

// Modify your renderChatMessage hook to handle more roll formats
Hooks.on("renderChatMessage", (message, html, data) => {
  html.find(".inline-roll").each((i, roll) => {
    const formula = roll.dataset.formula;
    const flavor = roll.dataset.flavor;
    console.log("Roll data:", { formula, flavor });

    // Check for various roll formats
    let target = null;

    // Check for "vs" format
    if (flavor?.includes("vs")) {
      const match = flavor.match(/vs\s*(\d+)/);
      if (match) {
        target = parseInt(match[1]);
      }
    }

    // Check for preceding number if no target found
    if (!target && formula === "1d100") {
      let node = roll.previousSibling;
      while (node) {
        const text = node.textContent.trim();
        const match = text.match(/(\d+)\s*$/); // Match number at end of text
        if (match) {
          target = parseInt(match[1]);
          break;
        }
        node = node.previousSibling;
      }
    }

    // If we found a target, process the roll
    if (target) {
      console.log("Processing roll with target:", target);
      const tRoll = new TargetRoll("1d100", target, {});
      tRoll.evaluate().then(() => {
        // Update the displayed roll
        const outcome = tRoll.outcome;
        roll.style.color = outcome.outcomeStyle.split(": ")[1];
        roll.title = `Target: ${target}\n${outcome.outcome}`;

        // If this is the initial roll (not just hovering), show the full message
        if (!roll.dataset.evaluated) {
          roll.dataset.evaluated = true;
          const messageContent = `
            <h2>Target Check</h2>
            <p>Target: ${target}</p>
            <p>Roll: ${tRoll.total}</p>
            <p>Outcome: <span style="${outcome.outcomeStyle}">${outcome.outcome}</span></p>
          `;
          roll.closest('.message-content').innerHTML = messageContent;
        }
      });
    }
  });
});

// Register chat command for /troll - this should be its own hook, not nested
Hooks.on('chatMessage', (chatLog, message, chatData) => {
  if (message.startsWith('/troll')) {
    const [command, target, ...rest] = message.split(' ');
    if (!target || isNaN(target)) {
      ui.notifications.error("Usage: /troll <target> [comment]");
      return false;
    }

    // Create and evaluate the roll
    const roll = new TargetRoll('1d100', parseInt(target), {});
    roll.evaluate().then(() => {
      roll.toMessage({
        flavor: rest.join(' '),
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
