export class Core100Item extends Item {
  /** @override */
  prepareData() {
    super.prepareData();

    if (this.type === 'skill') {
      this._prepareSkillData();
    }
  }

  /**
   * Prepare skill specific data
   */
  _prepareSkillData() {
    const itemData = this.system;
    const actorData = this.actor?.system;

    if (!actorData) return;

    // Calculate Success Number based on governing attribute and difficulty
    const governingAttr = actorData.primaryAttributes[itemData.governing]?.value || 0;
    const difficultyMod = itemData.difficulty === "Average" ? 10 : 5;
    
    itemData.successNumber = governingAttr + difficultyMod;
  }
}
