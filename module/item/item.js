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

// export class Core100Item extends Item {
//   /** @override */
//   prepareData() {
//     super.prepareData();

//     if (this.type === 'skill') {
//       const system = this.system;
//       // Ensure all fields exist with defaults
//       system.name= system.name ?? "Skill Name";
//       system.area = system.area ?? "";
//       system.governing = system.governing ?? "";
//       system.difficulty = system.difficulty ?? "Average";
//       system.successNumber = system.successNumber ?? 0;
//       system.specializations = system.specializations ?? [];
//       system.hasAdvantage = system.hasAdvantage ?? false;
//       system.description = system.description ?? "";

//       // // Ensure the name is defined
//       // this.name = this.name ?? "Unnamed Skill";

//       this._calculateSuccessNumber();
//     }
//   }

//   _calculateSuccessNumber() {
//     const system = this.system;
//     const actor = this.actor;

//     // Check if the governing attribute and actor are available
//     if (!actor || !system.governing) return;

//     // Fetch governing attribute value and difficulty modifier
//     const governingAttr = actor.system.primaryAttributes[system.governing]?.value || 0;
//     const difficultyMod = system.difficulty === "Average" ? 10 : 5;

//     // Set success number based on governing attribute and difficulty
//     system.successNumber = governingAttr + difficultyMod;
//   }
// }
