// module/item/item-sheet.js
export class Core100ItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["core100", "sheet", "item"],
      template: "systems/core100/templates/item/item-sheet.html",
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      submitOnClose: true,
      submitOnChange: true
    });
  }

  /** @override */
  async getData() {
    const context = super.getData();

    // Add system-specific data
    context.SKILL_AREAS = CONFIG.CORE100.skillAreas;
    context.ATTRIBUTES = CONFIG.CORE100.attributes;
    context.DIFFICULTIES = CONFIG.CORE100.difficulties;

    // Add the item data
    context.system = context.item.system;

    return context;
  }

  /** @override */
  async _updateObject(event, formData) {
    // Update the Item
    return this.object.update(formData);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Specialization Management
    html.find('.specialization-add').on('click', this._onAddSpecialization.bind(this));
    html.find('.specialization-remove').on('click', this._onRemoveSpecialization.bind(this));
  }

  /**
   * Handle adding a specialization
   * @private
   */
  async _onAddSpecialization(event) {
    event.preventDefault();
    const specializations = this.object.system.specializations || [];
    specializations.push("");
    return this.object.update({ 'system.specializations': specializations });
  }

  /**
   * Handle removing a specialization
   * @private
   */
  async _onRemoveSpecialization(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const row = element.closest('.specialization-item');
    const specializations = [...this.object.system.specializations];
    const index = row.dataset.index;
    specializations.splice(index, 1);
    return this.object.update({ 'system.specializations': specializations });
  }
}

// export class Core100ItemSheet extends ItemSheet {
//   static get defaultOptions() {
//     return foundry.utils.mergeObject(super.defaultOptions, {
//       classes: ["core100", "sheet", "item"],
//       template: "systems/core100/templates/item/item-sheet.html",
//       width: 520,
//       height: 480,
//       submitOnClose: true,
//       submitOnChange: true
//     });
//   }

//   /** @override */
//   async _updateObject(event, formData) {
//     console.log("Form Data before update:", formData);
//     await this.object.update(formData);

//     // Update item data based on form input
//     await this.object.update(formData);

//     // Recalculate success number after update
//     if (this.object.type === 'skill') {
//       this.object._calculateSuccessNumber();
//     }
//   }

//   getData() {
//     const context = super.getData();
//     const itemData = this.object;

//     // Return data to the template
//     return {
//       item: itemData,
//       system: itemData.system,
//       cssClass: context.cssClass
//     };
//   }

//   /** @override */
//   activateListeners(html) {
//     super.activateListeners(html);

//     // Everything below here is only needed if the sheet is editable
//     if (!this.isEditable) return;

//     // Handle adding a new specialization
//     html.find('.specialization-add').click(ev => {
//       ev.preventDefault();
//       const specializations = this.object.system.specializations || [];
//       specializations.push("");  // Add an empty specialization
//       this.object.update({ 'system.specializations': specializations });
//     });

//     // Handle removing an existing specialization
//     html.find('.specialization-remove').click(ev => {
//       ev.preventDefault();
//       const index = $(ev.currentTarget).siblings('input').index();
//       const specializations = this.object.system.specializations || [];
//       specializations.splice(index, 1);  // Remove the specialization
//       this.object.update({ 'system.specializations': specializations });
//     });

//     // Add inventory item
//     html.find('.item-create').click(this._onItemCreate.bind(this));

//     // Update Inventory Item
//     html.find('.item-edit').click(ev => {
//       const li = $(ev.currentTarget).parents(".item");
//       const item = this.actor.items.get(li.data("itemId"));
//       item.sheet.render(true);
//     });

//     // Delete Inventory Item
//     html.find('.item-delete').click(ev => {
//       const li = $(ev.currentTarget).parents(".item");
//       const item = this.actor.items.get(li.data("itemId"));
//       item.delete();
//     });
//   }
// }
