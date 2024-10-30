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
/*  Initialization                              */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log("core100 | Initializing Core 100 System");

  // Register Handlebars helpers
  Handlebars.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });

  Handlebars.registerHelper('upperCase', function(str) {
    return str.toUpperCase();
  });
  console.log("Core 100 | Register Handlebars");


  // First unregister default sheets
  console.log("Unregistering default sheets");
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

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

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("core100", Core100ActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("core100", Core100ItemSheet, { makeDefault: true });

  // Register system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Ready Hook (Debug Functions)                */
/* -------------------------------------------- */

Hooks.once('ready', () => {
  game.core100 = {
    debug: {
      refreshSheets: async () => {
        for (const window of Object.values(ui.windows)) {
          if (window instanceof ActorSheet) {
            // Force a re-render of the sheet
            window._state = Application.RENDER_STATES.NONE;
            window.render(true);
          }
        }
      },

      forceUpdateSheets: async () => {
        for (const window of Object.values(ui.windows)) {
          if (window instanceof ActorSheet) {
            await window.actor.render(false);  // Update the actor
            window._state = Application.RENDER_STATES.NONE;  // Reset render state
            await window.render(true);  // Force full re-render
          }
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
