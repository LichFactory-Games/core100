import { skillTemplate } from "../schema.js"

export class Core100Item extends Item {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["core100", "sheet", "item"]
    });
  }

  /** @override */
  prepareData() {
    super.prepareData();
    // Handle skill-specific preparations
    if (this.type === 'skill') {
      this._prepareSkillData();
    }
  }

  /**
   * Prepare skill specific data
   * @private
   */
  _prepareSkillData() {
    // Ensure the item has required fields
    const system = this.system;

    // Ensure specializations is always an array
    if (!Array.isArray(system.specializations)) {
      if (typeof system.specializations === 'object') {
        system.specializations = Object.values(system.specializations).filter(s => s !== null && s !== undefined);
      } else {
        system.specializations = [];
      }
    }

    // Calculate Success Number if we have an actor and governing attribute
    if (this.actor && system.governing) {
      const governingAttr = this.actor.system.primaryAttributes[system.governing]?.value || 0;
      const difficultyMod = system.difficulty === "average" ? 10 : 5;
      system.successNumber = governingAttr + difficultyMod;
    }
  }

  /** @override */
  static async create(data, options = {}) {
    // For new items, set up using template
    if (data.type === 'skill') {
      data = foundry.utils.mergeObject(skillTemplate, data);
    }
    return super.create(data, options);
  }
}
