export class Core100ItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["core100", "sheet", "item"],
      template: "systems/core100/templates/item/item-sheet.html",
      width: 520,
      height: 480,
      submitOnClose: true,
      submitOnChange: true
    });
  }

  /** @override */
  async _updateObject(event, formData) {
    return this.object.update(formData);
  }

  getData() {
    const context = super.getData();
    const itemData = this.object;

    // Return data to the template
    return {
      item: itemData,
      system: itemData.system,
      cssClass: context.cssClass
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add inventory item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
    });
  }
}
