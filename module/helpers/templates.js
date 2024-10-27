/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
        // Actor Sheet Partials
        "systems/core100/templates/actor/parts/actor-attributes.html",
        "systems/core100/templates/actor/parts/actor-skills.html",
        
        // Item Sheet Partials
        "systems/core100/templates/item/parts/item-description.html"
    ]);
};
