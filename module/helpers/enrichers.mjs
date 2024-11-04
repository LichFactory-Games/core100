export function registerSuccessRollEnricher() {
  CONFIG.TextEditor.enrichers.push({
    // Pattern to match optional name: {check Stealth 50} or {check 50}
    pattern: /\{check(?:\s+([A-Za-z\s]+))?\s+(\d+)\}/g,
    enricher: async function(match, options) {
      const skillName = match[1] ? match[1].trim() : '';
      const targetNumber = parseInt(match[2]);

      const temp = document.createElement('div');
      temp.innerHTML = `<a class="inline-roll roll target-roll" data-target="${targetNumber}" data-skill="${skillName}">
        <i class="fas fa-dice-d10"></i>
        ${skillName ? `${skillName} Check ` : 'Check '}
        <span class="target-number">${targetNumber}</span>
      </a>`;

      return temp.firstChild;
    }
  });

  document.body.addEventListener('click', async (event) => {
    const element = event.target.closest('.target-roll');
    if (!element) return;

    const target = Number(element.dataset.target);
    const skillName = element.dataset.skill || '';

    const roll = new game.core100.TargetRoll("1d100", target, skillName);
    await roll.evaluate();
    await roll.toMessage();
  });
}
