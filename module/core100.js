// Import required classes and sheets
import { Core100Actor } from "./actor/actor.js";
import { Core100ActorSheet } from "./actor/actor-sheet.js";
import { Core100Item } from "./item/item.js";
import { Core100ItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates } from "./helpers/templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log("core100 | Initializing Core 100 System");

  // Define custom Document classes
  CONFIG.Actor.documentClass = Core100Actor;
  CONFIG.Item.documentClass = Core100Item;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("core100", Core100ActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("core100", Core100ItemSheet, { makeDefault: true });

  // Register system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();
});

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
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to do anything until ready
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", function() {
  // Extend Token class if needed
});

/* -------------------------------------------- */
/*  Dice Roll Hooks                            */
/* -------------------------------------------- */

Hooks.on("createChatMessage", (message, options, userId) => {
  // Handle custom dice rolls if needed
});
