console.log("core100.js is loading");

// Import your modules
import { preloadHandlebarsTemplates } from "./helpers/templates.js";
import { Core100Actor } from "./actor/actor.js";
import { Core100ActorSheet } from "./actor/actor-sheet.js";
import { Core100Item } from "./item/item.js";
import { Core100ItemSheet } from "./item/item-sheet.js";

console.log("core100 imports completed");
console.log("Available classes:", {
  Core100Actor,
  Core100ActorSheet,
  Core100Item,
  Core100ItemSheet,
  ItemSheet
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
/*  Initialization                              */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log("core100 | Initializing Core 100 System");

  // First unregister default sheets
  console.log("Unregistering default sheets");
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  // Define custom Document classes
  console.log("Defining document classes");
  CONFIG.Actor.documentClass = Core100Actor;
  CONFIG.Item.documentClass = Core100Item;

  // Register new sheets
  console.log("Registering custom sheets");
  try {
    Actors.registerSheet("core100", Core100ActorSheet, { makeDefault: true });
    console.log("Actor sheet registered");

    Items.registerSheet("core100", Core100ItemSheet, { makeDefault: true });
    console.log("Item sheet registered");
  } catch (error) {
    console.error("Error registering sheets:", error);
  }

  // Preload templates
  try {
    await preloadHandlebarsTemplates();
    console.log("Templates preloaded");
  } catch (error) {
    console.error("Template preload error:", error);
  }
});

// Hooks.once("init", async function() {
//   console.log("core100 | Initializing Core 100 System");

//   // Define custom Document classes
//   CONFIG.Actor.documentClass = Core100Actor;
//   CONFIG.Item.documentClass = Core100Item;
//   console.log("core100 | Document classes configured");

//   // Register sheet application classes
//   try {
//     Actors.unregisterSheet("core", ActorSheet);
//     Actors.registerSheet("core100", Core100ActorSheet, { makeDefault: true });
//     console.log("core100 | Actor sheet registered");

//     Items.unregisterSheet("core", ItemSheet);
//     Items.registerSheet("core100", Core100ItemSheet, { makeDefault: true });
//     console.log("core100 | Item sheet registered");
//   } catch (error) {
//     console.error("core100 | Error registering sheets:", error);
//   }

//   // Register settings
//   registerSettings();
//   console.log("core100 | Settings registered");

//   // Register Handlebars helpers
//   registerHandlebarsHelpers();
//   console.log("core100 | Handlebars helpers registered");

//   // Preload templates
//   try {
//     await preloadHandlebarsTemplates();
//     console.log("core100 | Templates preloaded");
//   } catch (error) {
//     console.error("core100 | Template preload error:", error);
//   }
// });

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */
Hooks.once("ready", async function() {
  console.log("core100 | System Ready");
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */
Hooks.on("canvasInit", function() {
  console.log("core100 | Canvas Init");
});

console.log("core100.js finished loading");
