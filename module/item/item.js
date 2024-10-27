export class Core100Item extends Item {
  /** @override */
  prepareData() {
    super.prepareData();

    if (this.type === 'skill') {
      const system = this.system;
      // Ensure all fields exist with defaults
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

    // Check if the governing attribute and actor are available
    if (!actor || !system.governing) return;

    // Fetch governing attribute value and difficulty modifier
    const governingAttr = actor.system.primaryAttributes[system.governing]?.value || 0;
    const difficultyMod = system.difficulty === "Average" ? 10 : 5;

    // Set success number based on governing attribute and difficulty
    system.successNumber = governingAttr + difficultyMod;
  }
}
