export function registerEnrichTest() {
  CONFIG.TextEditor.enrichers.push({
    // Updated pattern to match optional name: {check Stealth 50} or {check 50}
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
// export function registerEnrichTest() {
//   CONFIG.TextEditor.enrichers.push({
//     // Match pattern like {check 50} - just target number to start
//     pattern: /\{check\s+(\d+)\}/g,
//     enricher: async function(match, options) {
//       const targetNumber = parseInt(match[1]);

//       // Create a temporary div to properly create HTML elements
//       const temp = document.createElement('div');
//       temp.innerHTML = `<a class="target-roll" data-target="${targetNumber}">
//         <i class="fas fa-dice-d10"></i>
//         Check ${targetNumber}
//       </a>`;

//       // Return the first child's HTML
//       return temp.firstChild;
//     }
//   });

//   // Add click handler
//   document.body.addEventListener('click', async (event) => {
//     const element = event.target.closest('.target-roll');
//     if (!element) return;

//     const target = Number(element.dataset.target);

//     // Create your custom roll
//     const roll = new game.core100.TargetRoll("1d100", target);
//     await roll.evaluate();
//     await roll.toMessage({
//       flavor: `Target Check (${target})`
//     });
//   });
// }

// export const registerEnrichTest = async (text) => {
//   const testEnricher = {
//     pattern: /\{check(?:\s+([A-Za-z]+))?\s+(-?\d+)\}/g,
//     enricher: async function(match, options) {
//       const rollExpression = '1d100'
//       const targetFeat = match[1]
//       const targetNumber = parseInt(match[2]);

//       return `<a class="TargetRoll" data-roll="1d100">
//         <i class="fas fa-dice-d10"></i>
//         ${targetFeat} at $(targetNumber)
//       </a>`;

//     }
//   }
//    // Register click handler for the enriched content
//   document.body.addEventListener('click', async (event) => {
//     if (event.target.closest('.TargetRoll')) {
//       const roll = new CustomRoll("1d100");
//       await roll.evaluate();
//       await roll.toMessage({
//         flavor: "Custom Roll Test",
//         speaker: ChatMessage.getSpeaker()
//       });
//     }
//   });
// };

//   // Remove any existing enricher with same pattern
//   CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.filter(e => e.pattern.toString() !== testEnricher.pattern.toString());

  // Add our enricher
  // CONFIG.TextEditor.enrichers.push(registerEnrichTest);
//   console.log("Core100 | Target roll enricher registered");
// };

// export const registerEnrichTest = async (text) => {
//   const testEnricher = {
//     pattern: /\{check(?:\s+([A-Za-z]+))?\s+(-?\d+)\}/g,
//     enricher: async function(match, options) {
//       const rollExpression = '1d100'
//       const targetFeat = match[1]
//       const targetNumber = parseInt(match[2]);

//       const wrapper = document.createElement("a");
//       wrapper.classList.add("inline-roll", "target-roll-trigger"); // Change from inline-roll to target-roll-trigger
//       wrapper.dataset.formula = rollExpression;
//       wrapper.dataset.target = targetNumber;

//       // Important: Remove any default roll handlers
//       wrapper.removeAttribute('data-roll');

//       wrapper.addEventListener('click', async function(event) {
//         event.preventDefault();
//         event.stopPropagation();

//         try {
//           const formula = this.dataset.formula;
//           const target = parseInt(this.dataset.target);

//           console.log("Creating TargetRoll with:", {formula, target});

//           // Create and evaluate roll
//           const roll = new game.core100.TargetRoll(formula, target);
//           console.log("Roll created:", roll);

//           if (!roll) {
//             throw new Error("Failed to create roll");
//           }

//           // Evaluate the roll
//           await roll.evaluate();
//           console.log("Roll evaluated:", roll);

//           // Get the outcome
//           roll.outcome = game.core100.evaluateRollOutcome(roll.total, target);
//           console.log("Roll outcome:", roll.outcome);

//           // Create the message
//           await roll.toMessage({
//             flavor: `Target Check (TN: ${target})`,
//             speaker: ChatMessage.getSpeaker(),
//             flags: {
//               core100: {
//                 isTargetRoll: true
//               }
//             }
//           });

//         } catch (err) {
//           console.error("Error in target roll:", err);
//           ui.notifications.error(`Roll failed: ${err.message}`);
//         }
//       });

//       wrapper.innerHTML = `<i class="fas fa-dice-d20"></i> ${rollExpression} TN:${targetNumber}`;
//       return wrapper;
//     }
//   };

//   // Remove any existing enricher with same pattern
//   CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.filter(e => e.pattern.toString() !== testEnricher.pattern.toString());

//   // Add our enricher
//   CONFIG.TextEditor.enrichers.push(testEnricher);
//   console.log("Core100 | Target roll enricher registered");
// };


// export const registerEnrichTest = async (text) => {
//   // Define the custom enricher configuration
//   const testEnricher = {
//     pattern: /{(\d+d\d+)\s+(\d+)}/g,
//     enricher: async function(match, options) {
//       const rollExpression = match[1];
//       const targetNumber = parseInt(match[2]);
//       const wrapper = document.createElement("a");
//       // wrapper.classList.add("inline-roll", "roll");
//       wrapper.classList.add("inline-roll");
//       wrapper.classList.add("target-roll");
//       wrapper.dataset.mode = "TargetRoll";
//       wrapper.dataset.formula = rollExpression;
//       wrapper.dataset.target = targetNumber;


//       $(wrapper).on('click', async function(event) {
//         event.preventDefault();
//         event.stopPropagation();
//         try {
//           // Create new TargetRoll instance
//           // const roll = new TargetRoll(rollExpression, targetNumber, {});

//           // // Evaluate the roll once
//           // await roll.evaluate();

//           } catch (err) {
//         console.error("Error in roll handler:", err);
//         ui.notifications.error(`Roll failed: ${err.message}`);
//       }
//         });

//       wrapper.innerHTML = `<i class="fas fa-dice-d10"></i>${rollExpression} TN: ${targetNumber}`;
//       return wrapper;
//     }
//   }
//   // Add the custom enricher to CONFIG
//   CONFIG.TextEditor.enrichers.push(testEnricher);
// };


export const OLDregisterEnrichTest = async (text) => {
  // Define the custom enricher configuration
  const goldEnricher = {
    pattern: /\{\{gold\}\}/g, // Match {{gold}} in the text
    enricher: async (match) => {
      // Create an icon element to replace the matched text
      const roll = new roll("1d100");

    },
    replaceParent: false // Only replace the text match, not the parent element
  };

  // Add the custom enricher to CONFIG temporarily
  CONFIG.TextEditor.enrichers.push(goldEnricher);

  // Enrich the text using TextEditor.enrichHTML
  const enrichedText = await TextEditor.enrichHTML(text || "", {
    // Optionally, disable default enrichers here
  });

  // // Remove the enricher after use
  // CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.filter(
  //   (enricher) => enricher !== goldEnricher
  // );

  return enrichedText;
};

// // Usage: Call enrichWithGoldIcon with any text you want to enrich
// const enrichedContent = await enrichWithGoldIcon("This treasure contains {{gold}}!");


export function registerSuccessMacroEnricher() {
  CONFIG.TextEditor.enrichers.push({
    pattern: /\{check(?:\s+([A-Za-z]+))?\s+(-?\d+)\}/g,
    enricher: async (match, options) => {
      const targetFeat = match[1];
      const targetNum = parseInt(match[2]);

      const a = document.createElement('a');
      a.classList.add('inline-roll', 'roll');
      a.innerHTML = `<i class="fas fa-dice-d20"></i> ${targetFeat ? `${targetFeat} (TN: ${targetNum})` : `Check (TN: ${targetNum})`}`;

      // Add roll data
      a.dataset.roll = '1d100';
      a.dataset.target = targetNum;
      if (targetFeat) a.dataset.feat = targetFeat;

      a.onclick = async (event) => {
        event.preventDefault();

                  const roll = new Roll('1d100');

        try {
          // Create the roll and immediately send it as a message
          const roll = new Roll('1d100');

          // Check if roll terms are defined
          if (!roll.terms || roll.terms.length === 0) {
            throw new Error("Roll terms are not initialized properly.");
          }

          // Await the toMessage method to automatically evaluate and send
          await roll.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            flavor: targetFeat ? `${targetFeat} Check (TN: ${targetNum})` : `Check (TN: ${targetNum})`,
            sound: CONFIG.sounds.dice
          });

          // Evaluate roll outcome after message creation
          const total = roll.total;
          const { outcome, outcomeStyle } = game.core100.evaluateRollOutcome(total, targetNum);

          console.log("Roll Total:", total, "Outcome:", outcome, "Outcome Style:", outcomeStyle);

        } catch(err) {
          console.error("Error in check roll:", err);
          ui.notifications.error("Error making check roll");
        }
      };

      return a;
    }
  });
}
