export class Core100Actor extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();

    const actorData = this;
    const data = actorData.system;

    // Make separate methods for each of these
    this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const data = actorData.system;

    // Calculate derived attributes
    this._calculateDerivedAttributes(data);
  }

  /**
   * Calculate all derived attributes based on primary attributes
   */
  _calculateDerivedAttributes(data) {
    const primary = data.primaryAttributes;
    const derived = data.derivedAttributes;

    // Health (VGR / 5)
    derived.hlt.max = Math.floor(primary.vgr.value / 5);
    derived.hlt.value = derived.hlt.value || derived.hlt.max;

    // Wounds (HLT / 5)
    derived.wd.max = Math.floor(derived.hlt.max / 5);
    derived.wd.value = derived.wd.value || derived.wd.max;

    // Grit ((VGR + PRS) / 5)
    derived.grt.max = Math.floor((primary.vgr.value + primary.prs.value) / 5);
    derived.grt.value = derived.grt.value || derived.grt.max;

    // Poise ((INS + GRT) / 5)
    derived.poi.max = Math.floor((primary.ins.value + derived.grt.max) / 5);
    derived.poi.value = derived.poi.value || derived.poi.max;
  }

  /**
   * Roll a skill check
   * @param {string} skillId The skill id to roll
   * @param {object} options Roll options
   */
  async rollSkillCheck(skillId, options={}) {
    const skill = this.items.get(skillId);
    if (!skill) return;

    const successNumber = skill.system.successNumber;
    const roll = new Roll("1d100");
    await roll.evaluate({async: true});

    const success = roll.total <= successNumber;
    
    // Create chat message
    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `Rolling ${skill.name}: [[${roll.total}]] vs DC ${successNumber} (${success ? "Success!" : "Failure"})`
    };

    ChatMessage.create(messageData);
  }
}
