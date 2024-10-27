export class Core100Actor extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();

    const actorData = this;

    // Ensure primary attributes exist
    if (!actorData.system.primaryAttributes) {
      actorData.system.primaryAttributes = {
        vgr: { value: 30, label: "Vigor" },
        grc: { value: 30, label: "Grace" },
        ins: { value: 30, label: "Insight" },
        prs: { value: 30, label: "Presence" }
      };
    }

    // Ensure derived attributes exist
    if (!actorData.system.derivedAttributes) {
      actorData.system.derivedAttributes = {
        hlt: { value: 0, max: 0, label: "Health" },
        wd: { value: 0, max: 0, label: "Wounds" },
        grt: { value: 0, max: 0, label: "Grit" },
        poi: { value: 0, max: 0, label: "Poise" }
      };
    }

    if (actorData.type === 'character') {
      this._prepareCharacterData(actorData);
    }
  }

  _prepareCharacterData(actorData) {
    const system = actorData.system;

    // Calculate derived attributes
    const vgr = system.primaryAttributes.vgr.value;
    const prs = system.primaryAttributes.prs.value;
    const ins = system.primaryAttributes.ins.value;

    // Health = VGR / 5
    system.derivedAttributes.hlt.max = Math.floor(vgr / 5);
    if (!system.derivedAttributes.hlt.value) {
      system.derivedAttributes.hlt.value = system.derivedAttributes.hlt.max;
    }

    // Wounds = HLT / 5
    system.derivedAttributes.wd.max = Math.floor(system.derivedAttributes.hlt.max / 5);
    if (!system.derivedAttributes.wd.value) {
      system.derivedAttributes.wd.value = system.derivedAttributes.wd.max;
    }

    // Grit = (VGR + PRS) / 5
    system.derivedAttributes.grt.max = Math.floor((vgr + prs) / 5);
    if (!system.derivedAttributes.grt.value) {
      system.derivedAttributes.grt.value = system.derivedAttributes.grt.max;
    }

    // Poise = (INS + GRT) / 5
    system.derivedAttributes.poi.max = Math.floor((ins + system.derivedAttributes.grt.max) / 5);
    if (!system.derivedAttributes.poi.value) {
      system.derivedAttributes.poi.value = system.derivedAttributes.poi.max;
    }
  }
}
