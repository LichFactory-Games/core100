export class Core100ItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["core100", "sheet", "item"],
      template: "systems/core100/templates/item/item-sheet.html",
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    
    context.systemData = context.item.system;
    context.skillAreas = [
      "Athletics",
      "Attention",
      "Education",
      "Fieldcraft",
      "Interpersonal",
      "Martial",
      "Material Crafts",
      "Medicine",
      "Operation",
      "Spiritual"
    ];

    context.attributes = {
      vgr: "Vigor",
      grc: "Grace",
      ins: "Insight",
      prs: "Presence"
    };

    context.difficulties = ["Average", "Demanding"];

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add any special button handlers, etc. here
  }
}
