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
    context.system = actorData.system;
    context.rollData = context.actor.getRollData();
    context.skills = this._organizeSkills();

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

  /**
   * Organize skills by area
   * @private
   */
  _organizeSkills() {
    const skills = new Map();

    // Add all skill areas even if empty
    const areas = [
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

    areas.forEach(area => skills.set(area, []));

    // Organize items by type
    for (let item of this.actor.items) {
      if (item.type === 'skill') {
        const area = item.system.area || "Uncategorized";
        if (!skills.has(area)) skills.set(area, []);
        skills.get(area).push(item);
      }
    }

    // Convert to object for handlebars
    const skillsObject = {};
    for (let [key, value] of skills) {
      if (value.length > 0) skillsObject[key] = value;
    }

    return skillsObject;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Add listeners for attribute rolls
    html.find('.attribute-check').click(this._onAttributeCheck.bind(this));

    // Skill checks
    html.find('.skill-check').click(this._onSkillCheck.bind(this));


    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Skill
    html.find('.skill-create').click(this._onItemCreate.bind(this));  // Add this line


    // Render the item sheet for viewing/editing
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
   * Handle attribute checks (1d100)
   * @param {Event} event   The originating click event
   * @private
   */
  async _onAttributeCheck(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attribute = element.dataset.attribute;

    const attrValue = this.actor.system.primaryAttributes[attribute].value;
    const attrLabel = this.actor.system.primaryAttributes[attribute].label;

    const roll = await new Roll("1d100").evaluate({async: true});
    const success = roll.total <= attrValue;

    const messageContent = `
      <h2>${attrLabel} Check</h2>
      <p>Target: ${attrValue}</p>
      <p>Roll: ${roll.total}</p>
      <p style="color: ${success ? 'green' : 'red'}">
        ${success ? 'Success!' : 'Failure'}
      </p>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: messageContent,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: roll
    });
  }

  /**
   * Handle attribute generation (4d10+30)
   * @param {Event} event   The originating click event
   * @private
   */
  async _onAttributeGenerate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attribute = element.dataset.attribute;

    const roll = await new Roll("4d10+30").evaluate({async: true});

    await this.actor.update({
      [`system.primaryAttributes.${attribute}.value`]: roll.total
    });

    const messageContent = `
      <h2>${this.actor.system.primaryAttributes[attribute].label} Generation</h2>
      <p>Roll: ${roll.total}</p>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: messageContent,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: roll
    });
  }

  /**
   * Handle creating a new Owned Item for the actor
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();

    console.log("Creating new skill");
    const itemData = {
      name: "New Skill",
      type: "skill",
      system: {
        area: "",
        governing: "",
        difficulty: "Average",
        successNumber: 0,
        specializations: [],
        hasAdvantage: false,
        description: ""
      }
    };

    console.log("Item creation data:", itemData);

    try {
      const created = await Item.create(itemData, {parent: this.actor});
      console.log("Skill created:", created);
      created.sheet.render(true);
    } catch (err) {
      console.error("Error creating skill:", err);
    }
  }

  /**
   * Handle skill check rolls
   * @param {Event} event The originating click event
   * @private
   */
  async _onSkillCheck(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = $(element).closest("[data-item-id]").data("itemId");
    const skill = this.actor.items.get(itemId);

    if (!skill) return;

    const roll = await new Roll("1d100").evaluate({async: true});
    const success = roll.total <= skill.system.successNumber;

    const messageContent = `
        <h2>${skill.name} Check</h2>
        <p>Target: ${skill.system.successNumber}</p>
        <p>Roll: ${roll.total}</p>
        <p style="color: ${success ? 'green' : 'red'}">${success ? 'Success!' : 'Failure'}</p>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: messageContent,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: roll
    });
  }

}
