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
  getData() {
    const context = super.getData();

    // Add system-specific data
    context.SKILL_AREAS = CONFIG.CORE100.skillAreas;
    context.ATTRIBUTES = CONFIG.CORE100.attributes;
    context.DIFFICULTIES = CONFIG.CORE100.difficulties;

    // Add the item data
    context.system = context.item.system;

    // Ensure specializations array exists
    if (!context.system.specializations) {
      context.system.specializations = [];
    }

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    // Handle adding a specialization
    html.find('.specialization-add').click(this._onAddSpecialization.bind(this));

    // Handle removing a specialization
    html.find('.specialization-remove').click(this._onRemoveSpecialization.bind(this));
  }

  /** @private */
  async _onAddSpecialization(event) {
    event.preventDefault();
    const specializations = this.object.system.specializations || [];
    specializations.push("");

    await this.object.update({
      'system.specializations': specializations
    });
  }

  /** @private */
  async _onRemoveSpecialization(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const container = button.closest('.specialization-item');
    const index = container.dataset.index;

    const specializations = [...this.object.system.specializations];
    specializations.splice(index, 1);

    await this.object.update({
      'system.specializations': specializations
    });
  }

  /** @override */
  async _updateObject(event, formData) {
    // Handle the form submission
    await super._updateObject(event, formData);
  }
}
