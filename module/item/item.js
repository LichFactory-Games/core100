export class Core100Item extends Item {
  /** @override */
  prepareData() {
    super.prepareData();

    if (this.type === 'skill') {
      // Initialize data structure
      const system = this.system;

      // Ensure all fields exist
      system.area = system.area ?? "";
      system.governing = system.governing ?? "";
      system.difficulty = system.difficulty ?? "Average";
      system.successNumber = system.successNumber ?? 0;
      system.specializations = system.specializations ?? [];
      system.hasAdvantage = system.hasAdvantage ?? false;
      system.description = system.description ?? "";

      this._calculateSuccessNumber();
    }
  }

  _calculateSuccessNumber() {
    const system = this.system;
    const actor = this.actor;

    if (!actor || !system.governing) return;

    const governingAttr = actor.system.primaryAttributes[system.governing]?.value || 0;
    const difficultyMod = system.difficulty === "Average" ? 10 : 5;
    system.successNumber = governingAttr + difficultyMod;
  }
}
