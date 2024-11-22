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
    if (this.type === 'skill') {
      this._prepareSkillData();
    }
  }

  _prepareSkillData() {
    const system = this.system;

    // Handle specializations
    if (!Array.isArray(system.specializations)) {
      if (typeof system.specializations === 'object') {
        system.specializations = Object.values(system.specializations)
          .filter(s => s !== null && s !== undefined);
      } else {
        system.specializations = [];
      }
    }

    // Initialize bonus if not present
    if (typeof system.epBonus !== 'number') {
      system.epBonus = 0;
    }

    // Calculate Success Number including any EP bonus
    if (this.actor && system.governing) {
      const governingAttr = this.actor.system.primaryAttributes[system.governing]?.value || 0;
      const difficultyMod = system.difficulty === "average" ? 10 : 5;
      system.successNumber = governingAttr + difficultyMod + system.epBonus;
    }
  }

  /** @override */
  static async create(data, options = {}) {
    if (data.type === 'skill') {
      const template = foundry.utils.mergeObject({
        ...skillTemplate,
        system: {
          ...skillTemplate.system,
          epBonus: 0  // Initialize EP bonus
        }
      }, data);

      // If bonus was specified in character creation, use it
      if (data.system?.epBonus) {
        template.system.epBonus = data.system.epBonus;
      }

      data = template;
    }
    return super.create(data, options);
  }
}
