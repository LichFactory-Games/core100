export class Core100ActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
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
    html.find('.skill-create').click(this._onItemCreate.bind(this));

    // Skill Edit
    html.find('.skill-edit').click(ev => {
      const skillElement = $(ev.currentTarget).closest(".skill");
      const skillId = skillElement.data("item-id");
      const skill = this.actor.items.get(skillId);
      if (skill) skill.sheet.render(true);
    });

    // Skill Delete
    html.find('.skill-delete').click(ev => {
      const skillElement = $(ev.currentTarget).closest(".skill");
      const skillId = skillElement.data("item-id");
      const skill = this.actor.items.get(skillId);
      if (skill) {
        skill.delete();
      }
    });
  }

  /**
   * Determine roll outcome based on target value and roll result.
   * @param {number} rollResult - The total of the d100 roll.
   * @param {number} target - The target value to beat (attribute or skill's success number).
   * @returns {Object} An object containing the outcome and style.
   */
  evaluateRollOutcome(rollResult, target) {
    const isDoubles = rollResult % 11 === 0;
    let outcome = "";
    let outcomeStyle = "color: black"; // Default style

    if (rollResult <= target) { // Success cases
      if (isDoubles) {
        outcome = "Ace";
        outcomeStyle = "color: goldenrod";
      } else if (rollResult <= Math.floor(target / 2)) {
        outcome = "Success";
        outcomeStyle = "color: green";
      } else {
        outcome = "Partial Success";
        outcomeStyle = "color: darkblue";
      }
    } else { // Failure cases
      if (isDoubles) {
        outcome = "Fumble";
        outcomeStyle = "color: red";
      } else if (rollResult <= Math.floor((100 - target) / 2) + target) {
        outcome = "Partial Failure";
        outcomeStyle = "color: brown";
      } else {
        outcome = "Failure";
        outcomeStyle = "color: crimson";
      }
    }
    return { outcome, outcomeStyle };
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
    const rollResult = roll.total;

    const { outcome, outcomeStyle } = this.evaluateRollOutcome(rollResult, attrValue);

    const messageContent = `
      <h2>${attrLabel} Check</h2>
      <p>Target: ${attrValue}</p>
      <p>Roll: ${rollResult}</p>
      <p>Outcome: <span style="${outcomeStyle}">${outcome}</span></p>
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
      type: CONST.CHAT_MESSAGE_STYLES.ROLL,
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

    const successNumber = skill.system.successNumber;
    const hasSpecialization = skill.system.specializations && skill.system.specializations.length > 0;

    // Roll with or without Advantage based on specialization
    let rollResult;
    if (hasSpecialization) {
      const roll1 = await new Roll("1d100").evaluate({async: true});
      const roll2 = await new Roll("1d100").evaluate({async: true});
      rollResult = Math.min(roll1.total, roll2.total); // Advantage: take the lower roll
    } else {
      const roll = await new Roll("1d100").evaluate({async: true});
      rollResult = roll.total;
    }

    // Get outcome and style based on the roll result
    const { outcome, outcomeStyle } = this.evaluateRollOutcome(rollResult, successNumber);

    const messageContent = `
        <h2>${skill.name} Check</h2>
        <p>Target: ${successNumber}</p>
        <p>Roll: ${rollResult}</p>
        <p>Outcome: <span style="${outcomeStyle}">${outcome}</span></p>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: messageContent,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: rollResult
    });
  }
}
