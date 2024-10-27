export class Core100ActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["core100", "sheet", "actor"],
      template: "systems/core100/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-navigation",
        contentSelector: ".sheet-body",
        initial: "attributes"
      }]
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.system for easier access
    context.system = actorData.system;

    // Add roll data for TinyMCE editors
    context.rollData = context.actor.getRollData();

    // Prepare character data and items
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    return context;
  }

  _prepareCharacterData(context) {
    // Add any custom character data preparation here
  }

  _prepareItems(context) {
    // Add any item data preparation here
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Render the item sheet for viewing/editing prior to the editable check.
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

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    // Get the type of item to create.
    const type = element.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(element.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }
}
