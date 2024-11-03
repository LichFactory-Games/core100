/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  const templatePaths = [
    // Actor Sheet
    "systems/core100/templates/actor/actor-sheet.html",
    "systems/core100/templates/actor/parts/actor-attributes.html",
    // Item Sheet
    "systems/core100/templates/item/item-sheet.html",
    "systems/core100/templates/chat/target-roll.hbs"
  ];

  return loadTemplates(templatePaths);
};
