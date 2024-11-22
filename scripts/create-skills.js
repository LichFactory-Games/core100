// scripts/create-skills.js

const athleticsSkills = [
  {
    name: "Agility",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "athletics",
      governing: "grc", // Grace for physical coordination
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Agility is the skill of moving with speed, grace, and precision. It encompasses a broad range of physical abilities that require coordination, balance, and quick reflexes. Practitioners of this skill can navigate difficult terrain, perform complex physical maneuvers, and react swiftly to changing situations.",
      possibleSpecializations: ["Acrobatics", "Climbing", "Stealth"]
    }
  },
  {
    name: "Endurance",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "athletics",
      governing: "vgr", // Vigor for stamina and physical resilience
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Endurance is the skill of sustaining prolonged physical effort and resisting fatigue. It represents an individual's stamina, resilience, and ability to push their body to its limits. This skill is essential for long-term survival situations, extended pursuits, or escapes.",
      possibleSpecializations: ["Running", "Swimming"]
    }
  }
];

const attentionSkills = [
  {
    name: "Observation",
    type: "skill",
    img: "icons/svg/mystery-man.svg", // Example icon
    system: {
      area: "attention",
      governing: "ins",
      difficulty: "average",
      isType: false,
      isPrerequisite: true,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Observation is the ability to notice and interpret details in one's environment. It involves keen awareness of surroundings, picking up on subtle cues, and drawing accurate conclusions from visual information. This skill is crucial for investigators, security personnel, and anyone who needs to stay alert and gather information from their environment.",
      possibleTypes: [],
      possibleSpecializations: ["Vigilance", "Searching", "Tracking"]
    }
  },
  {
    name: "Kinesics",
    type: "skill",
    img: "icons/svg/mystery-man.svg", // Example icon
    system: {
      area: "attention",
      governing: "ins",
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Observation"],
      hasAdvantage: false,
      description: "Kinesics is the study and interpretation of non-verbal communication through body language, facial expressions, and gestures. This demanding skill requires a deep understanding of human behavior and the ability to read subtle physical cues that often contradict or supplement verbal communication. Mastery of kinesics is valuable in fields such as law enforcement, psychology, and diplomacy.",
      possibleTypes: [],
      possibleSpecializations: ["Lie Detection", "Empathy"]
    }
  },
  {
    name: "Profiling",
    type: "skill",
    img: "icons/svg/mystery-man.svg", // Example icon
    system: {
      area: "attention",
      governing: "ins",
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Observation"],
      hasAdvantage: false,
      description: "Profiling is the complex process of analyzing behavioral patterns, personality traits, and demographic information to create a psychological portrait of an individual or group. Profilers use their expertise to predict behavior, assist in criminal investigations, or develop strategies targeting specific psychological profiles.",
      possibleTypes: [],
      possibleSpecializations: ["Criminal Profiling", "Consumer Behavior", "Personality Assessment"]
    }
  },
  {
    name: "Surveillance",
    type: "skill",
    img: "icons/svg/mystery-man.svg", // Example icon
    system: {
      area: "attention",
      governing: "ins",
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Observation"],
      hasAdvantage: false,
      description: "Surveillance is the systematic observation of people, places, or objects, typically for security, intelligence gathering, or investigative purposes. This skill involves techniques for covert observation, use of surveillance equipment, and the ability to maintain focus over extended periods. Surveillance is essential in law enforcement, private investigation, and counterintelligence operations.",
      possibleTypes: [],
      possibleSpecializations: ["Electronic Surveillance", "Physical Surveillance", "Aerial Surveillance"]
    }
  },
  {
    name: "Countersurveillance",
    type: "skill",
    img: "icons/svg/mystery-man.svg", // Example icon
    system: {
      area: "attention",
      governing: "ins",
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Observation", "Surveillance"],
      hasAdvantage: false,
      description: "Countersurveillance involves techniques and practices used to detect, evade, or neutralize surveillance efforts by others. This skill requires a thorough understanding of surveillance methods, as well as the ability to think creatively and remain calm under pressure. Countersurveillance is crucial for personal security, protecting sensitive information, and maintaining operational security in various fields.",
      possibleTypes: [],
      possibleSpecializations: ["Technical Countermeasures", "Physical Security", "Evasion"]
    }
  }
];

const educationSkills = [
  {
    name: "Analysis",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "demanding",
      isType: false,
      isPrerequisite: true,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Analysis is the complex process of examining data, information, or situations to identify patterns, draw conclusions, and solve problems. This skill requires critical thinking, logical reasoning, and the ability to synthesize diverse pieces of information. Analysts must be adept at breaking down complex issues, evaluating evidence, and communicating their findings clearly. This skill is crucial in fields such as intelligence, business strategy, and scientific research.",
      possibleSpecializations: ["Data Analysis", "Intelligence Analysis", "Financial Analysis"]
    }
  },
  {
    name: "Research",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "demanding",
      isType: false,
      isPrerequisite: true,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Research is the systematic study of materials and sources to establish facts and reach new conclusions. It involves defining problems, designing studies, collecting data, and interpreting results.",
      possibleSpecializations: ["Academic Research", "Market Research", "Scientific Research"]
    }
  },
  {
    name: "Finance",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins", // Insight for analysis and understanding of economic systems
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [], // Could potentially require Administration if you want
      hasAdvantage: false,
      description: "Finance is the skill of managing monetary resources, understanding economic systems, and making strategic financial decisions. It involves analyzing market trends, managing investments, and understanding complex financial instruments.",
      possibleSpecializations: ["Forensic Accounting", "Money Laundering"]
    }
  },
  {
    name: "Humanities",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "demanding",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Anthropology", "Literature", "Philosophy", "History", "Art History"],
      prerequisites: ["Research"],
      hasAdvantage: false,
      description: "Humanities encompass the study of human culture, history, and creative expression. Skill in the Humanities requires deep knowledge in areas such as literature, philosophy, history, or the arts. Practitioners must be able to analyze complex texts, understand cultural contexts, and draw connections across different fields of study.",
      possibleSpecializations: ["Occult Literature", "Esoteric Philosophy", "Folklore and Mythology", "Ancient Civilizations", "Paranormal Art", "Conspiracy Theories"]
    }
  },
  {
    name: "Science",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "demanding",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Physics", "Chemistry", "Biology", "Forensics", "Environmental Science"],
      prerequisites: ["Research"],
      hasAdvantage: false,
      description: "Science represents specialized knowledge in a particular scientific field. This skill involves understanding complex scientific principles, conducting experiments, analyzing data, and applying scientific methods to solve problems. Practitioners must stay current with the latest research, possess strong analytical skills, and be able to communicate technical information clearly. This skill is essential for advancing knowledge and developing new technologies in various scientific disciplines.",
      possibleSpecializations: ["Fringe Physics", "Quantum Mechanics", "Parapsychology", "Forensic Chemistry", "Toxicology", "Biochemical Anomalies", "Cryptozoology", "Genetic Mutations", "Epidemiology", "Paranormal Ecology", "Atmospheric Phenomena", "Geologic Anomalies"]
    }
  },
  {
    name: "Law",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Research"],
      hasAdvantage: false,
      description: "Law is the study and practice of legal systems and regulations. It requires mastery of legal principles, statutes, and case law, along with skills in research, analysis, and argumentation. Legal practitioners must interpret complex documents and apply legal concepts across diverse situations.",
      possibleSpecializations: ["Criminal Law", "Corporate Law", "International Law"]
    }
  },
  {
    name: "Languages",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "education",
      governing: "ins",
      difficulty: "average",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["German", "Greek", "Latin", "Mandarin", "Sanskrit"],
      prerequisites: [],
      hasAdvantage: false,
      description: "Language proficiency is the ability to communicate effectively in a foreign language through speaking and writing. It encompasses grammar, vocabulary, idioms, and cultural understanding, with competency ranging from basic conversation to advanced fluency.",
      possibleSpecializations: ["Business Language", "Literary Translation", "Simultaneous Interpretation"]
    }
  }
];

const fieldcraftSkills = [
  {
    name: "Navigation",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "fieldcraft",
      governing: "ins", // Insight for spatial awareness and interpretation
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Navigation is the skill of determining position, planning routes, and guiding oneself or others from one place to another. It encompasses various methods and tools, from traditional map and compass use to modern GPS systems. This skill requires spatial awareness, the ability to read and interpret maps, and adaptability to different environments.",
      possibleSpecializations: ["Urban Navigation", "Wilderness Orienteering", "Celestial Navigation", "Underground Mapping", "Tactical Reconnaissance"]
    }
  },
  {
    name: "Survival",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "fieldcraft",
      governing: "vgr", // Vigor for endurance and resilience
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Survival is the skill of staying alive and functional in hostile or challenging environments. It encompasses a broad range of abilities including finding food and water, building shelter, avoiding natural hazards, and performing basic first aid. This skill requires resourcefulness, mental fortitude, and adaptability.",
      possibleSpecializations: ["Arctic Survival", "Desert Survival", "Urban Survival", "Hunting", "Psychological Resilience"]
    }
  },
  {
    name: "Concealment",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "fieldcraft",
      governing: "grc", // Grace for physical dexterity
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Concealment is the skill of hiding objects, information, or oneself from detection. This skill involves understanding sight lines, utilizing environmental features, and employing various techniques to avoid notice. It requires a keen awareness of surroundings, creativity, and often physical dexterity.",
      possibleSpecializations: ["Camouflage", "Steganography", "Cryptography", "Slight of Hand", "Shadow Blending"]
    }
  },
  {
    name: "Evasion",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "fieldcraft",
      governing: "grc", // Grace for agility
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Concealment"],
      hasAdvantage: false,
      description: "Evasion is the skill of avoiding detection, pursuit, or capture. It involves a combination of physical agility, environmental awareness, and quick thinking. Practitioners of this skill are adept at losing tails, finding escape routes, and misdirecting pursuers.",
      possibleSpecializations: ["Urban Evasion", "Wilderness Evasion", "Digital Evasion", "Vehicular Evasion", "Diversion"]
    }
  },
  {
    name: "Disguise",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "fieldcraft",
      governing: "prs", // Presence for behavioral mimicry
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Disguise is the art of altering appearances through makeup, prosthetics, clothing, and behavioral mimicry to prevent recognition or enable impersonation. It combines technical skill and psychological understanding for covert operations and undercover work.",
      possibleSpecializations: ["Theatrical Makeup", "Quick-Change Artistry", "Voice Imitation", "Cultural Mimicry"]
    }
  }
];

const interpersonalSkills = [
  {
    name: "Persuasion",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "prs", // Presence for social influence
      difficulty: "average",
      isType: false,
      isPrerequisite: true,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Persuasion is the skill of convincing others to adopt a particular belief or course of action. It involves using logical arguments, emotional appeals, and personal charisma to influence people's thoughts and behaviors. In an investigative horror context, persuasion can be crucial for gathering information from reluctant witnesses, convincing authorities to take threats seriously, or rallying allies to one's aid.",
      possibleSpecializations: ["Negotiation", "Leadership", "Emotional Manipulation", "Debate"]
    }
  },
  {
    name: "Deception",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "prs", // Presence for social manipulation
      difficulty: "average",
      isType: false,
      isPrerequisite: true,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Deception is the skill of convincing others to believe false information or obscuring the truth. This includes lying convincingly, misdirection, and creating plausible cover stories.",
      possibleSpecializations: ["Bluffing", "Forgery", "Fast Talk", "Misdirection", "Feigning Emotions"]
    }
  },
  {
    name: "Social Engineering",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "prs", // Presence for social manipulation
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Persuasion", "Deception"],
      hasAdvantage: false,
      description: "Social Engineering is the skill of manipulating people into divulging confidential information or performing actions that may compromise security. It combines elements of psychology, persuasion, and deception to exploit human vulnerabilities.",
      possibleSpecializations: ["Phishing Techniques", "Pretexting", "Tailgating", "Psychological Manipulation"]
    }
  },
  {
    name: "Diplomacy",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "prs", // Presence for social influence
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Persuasion"],
      hasAdvantage: false,
      description: "Diplomacy is the skill of managing inter-group relations, negotiations, and conflicts. It requires a deep understanding of cultural nuances, political landscapes, and negotiation tactics.",
      possibleSpecializations: ["Cultural Mediation", "Treaty Negotiation", "Conflict Resolution"]
    }
  },
  {
    name: "Administration",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "ins", // Insight for organizational understanding
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Administration is the skill of managing resources, personnel, and information within an organization. It involves coordinating activities, maintaining records, and ensuring operational efficiency.",
      possibleSpecializations: ["Project Management", "Human Resources", "Logistics", "Information Security"]
    }
  },
  {
    name: "Larceny",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "interpersonal",
      governing: "grc", // Grace for manual dexterity
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Deception"],
      hasAdvantage: false,
      description: "Larceny is the skill of theft and other crimes. It encompasses a range of techniques from pickpocketing to complex heists. This skill requires manual dexterity, strategic planning, and knowledge of security systems.",
      possibleSpecializations: ["Grifting", "Pickpocketing", "Lockpicking", "Safe Cracking"]
    }
  }
];

const martialSkills = [
  {
    name: "Tactics",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "martial",
      governing: "ins", // Insight for strategic thinking
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Tactics is the skill of planning and directing actions in conflict situations. It involves analyzing terrain, positioning, timing, and resources to gain advantages in various scenarios. This skill requires strategic thinking, adaptability, and the ability to anticipate opponent actions.",
      possibleSpecializations: ["Urban Combat Tactics", "Wilderness Survival Tactics", "Insurgency Tactics", "Crowd Control"]
    }
  },
  {
    name: "Close Quarters Combat",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "martial",
      governing: "grc", // Grace for physical combat
      difficulty: "average",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Unarmed Combat", "Knife Fighting", "Improvised Weapons", "Blunt Weapons"],
      prerequisites: [],
      hasAdvantage: false,
      description: "Close Quarters Combat (CQC) represents proficiency in hand-to-hand and melee weapon combat techniques. This skill involves understanding body mechanics, weapon handling, and spatial awareness in confined spaces. Practitioners are adept at both offensive and defensive maneuvers at close range.",
      possibleSpecializations: ["Grappling", "Disarming Techniques", "Silent Takedowns", "Pressure Points", "Knock Out Punch"]
    }
  },
  {
    name: "Ranged Combat",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "martial",
      governing: "grc", // Grace for aim and control
      difficulty: "average",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Handguns", "Rifles", "Shotguns", "Archery", "Thrown Weapons"],
      prerequisites: [],
      hasAdvantage: false,
      description: "Ranged Combat skill covers proficiency with distance weapons, including firearms and thrown objects. It encompasses aiming, breath control, ballistics understanding, and weapon maintenance.",
      possibleSpecializations: ["Trick Shots", "Long-Range Marksmanship", "Quick Draw"]
    }
  }
];

const materialCraftsSkills = [
  {
    name: "Fabrication",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "materialCrafts",
      governing: "grc", // Assuming Grace for fine manual work
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Fabrication is the creation and modification of physical objects using diverse materials and techniques, ranging from woodworking to metalsmithing. It enables both practical construction and artistic creation, while also supporting investigative work through tool-making and object analysis.",
      possibleSpecializations: ["Metalworking", "Carpentry", "3D Printing", "Improvised Tools", "Jury-Rigging"]
    }
  },
  {
    name: "Textiles",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "materialCrafts",
      governing: "grc", // Assuming Grace for fine manual work
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Textiles is the manipulation and analysis of fabrics and fibers, including their creation, repair, and identification. It combines technical knowledge of materials and weaving with practical applications in forensic examination and cultural artifact analysis.",
      possibleSpecializations: ["Fabric Identification", "Historical Textiles", "Forensic Fiber Analysis", "Clothing Repair"]
    }
  },
  {
    name: "Maintenance/Repair",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "materialCrafts",
      governing: "ins", // Assuming Insight for diagnostic work
      difficulty: "average",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Electronics", "Vehicles", "Buildings", "Machinery"],
      prerequisites: [],
      hasAdvantage: false,
      description: "Maintenance/Repair encompasses the diagnosis, upkeep, and restoration of equipment and structures. It combines mechanical knowledge with problem-solving skills to keep systems functional and determine causes of failure or tampering.",
      possibleSpecializations: ["Antique Restoration", "Improvised Repairs", "Forensic Engineering", "Sabotage Detection", "IT Systems"]
    }
  },
  {
    name: "Explosives",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "materialCrafts",
      governing: "ins", // Assuming Insight for technical knowledge
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "The Explosives skill involves the knowledge and handling of explosive materials and devices. This demanding skill requires a deep understanding of chemistry, physics, and safety protocols. Practitioners can identify different types of explosives, understand their properties, and safely handle or dispose of them. In investigative scenarios, this skill is valuable for analyzing blast scenes, defusing bombs, or understanding the construction of explosive devices.",
      possibleSpecializations: ["Demolitions", "Bomb Disposal", "Pyrotechnics", "Improvised Explosives"]
    }
  }
];

const medicineSkills = [
  {
    name: "Trauma Care",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "medicine",
      governing: "grc", // Grace for surgical precision and quick hands
      difficulty: "average",
      isType: false,
      isPrerequisite: true, // Making this a prerequisite for specialties
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Trauma Care is the skill of providing immediate and critical medical attention to severely injured individuals. This skill involves quick assessment of injuries, stabilization techniques, and the ability to perform life-saving procedures under pressure. Practitioners must have a strong understanding of human anatomy, wound management, and emergency medical protocols. Trauma care skills could be crucial for keeping team members alive in dangerous situations.",
      possibleSpecializations: ["Battlefield Medicine", "Rehabilitation", "Crisis Counseling", "Improvised Medical Tools"]
    }
  },
  {
    name: "Psychiatry",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "medicine",
      governing: "ins", // Insight for analysis and understanding
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Trauma Care"],
      hasAdvantage: false,
      description: "Psychiatry is the medical diagnosis and treatment of mental disorders through clinical analysis, medication, and therapy, requiring expertise in human behavior, pharmacology, and therapeutic interventions.",
      possibleSpecializations: ["Trauma Psychiatry", "Cult Deprogramming", "Paranormal Psychology", "Cognitive Behavioral Therapy", "Psychoanalysis"]
    }
  },
  {
    name: "Medical Research",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "medicine",
      governing: "ins", // Insight for analysis and methodology
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Trauma Care"],
      hasAdvantage: false,
      description: "Medical Research is the skill of conducting scientific studies to advance medical knowledge and develop new treatments. This skill involves designing experiments, analyzing data, and interpreting results in the context of human health and disease. It requires a strong foundation in biology, chemistry, and scientific methodology.",
      possibleSpecializations: ["Epidemiology", "Immunology", "Pathology", "Pharmacology"]
    }
  },
  {
    name: "Holistic Medicine",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "medicine",
      governing: "prs", // Presence for patient interaction and empathy
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Trauma Care"],
      hasAdvantage: false,
      description: "Holistic Medicine treats individuals by integrating physical, mental, and emotional health, combining alternative healing practices with conventional medicine to create comprehensive treatment plans.",
      possibleSpecializations: ["Acupuncture", "Energy Healing", "Herbal Remedies", "Mind-Body Techniques", "Ritual Cleansing"]
    }
  }
];

const operationSkills = [
  {
    name: "Pilot",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "grc", // Grace for vehicle control
      difficulty: "demanding",
      isType: true,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: ["Aircraft", "Helicopters", "Boats", "Submersibles", "Drones"],
      prerequisites: [],
      hasAdvantage: false,
      description: "Piloting is the operation of vehicles or aircraft, requiring mastery of mechanical systems, navigation, and emergency procedures while maintaining situational awareness in dynamic conditions.",
      possibleSpecializations: ["Night Flying", "Aerial Reconnaissance", "Evasive Maneuvering", "Experimental Craft Operation"]
    }
  },
  {
    name: "Computer Use",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for technical understanding
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Computer Use is the skill of effectively operating and manipulating computer systems and software. This skill encompasses a range of abilities from basic software operation to advanced programming and system administration. Practitioners should be adept at navigating various operating systems, troubleshooting common issues, and utilizing software tools effectively.",
      possibleSpecializations: ["Digital Forensics", "Cryptography", "Network Security", "Data Recovery"]
    }
  },
  {
    name: "Heavy Machinery",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "grc", // Grace for equipment control
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Heavy Machinery operation combines technical knowledge and physical coordination to control large industrial equipment, requiring understanding of mechanical capabilities, safety protocols, and basic maintenance procedures.",
      possibleSpecializations: ["Excavation Equipment", "Industrial Lifting", "Demolition Machinery", "Mining Equipment"]
    }
  },
  {
    name: "Electronics",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for technical understanding
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "The skill of understanding, operating, and manipulating electronic devices and systems. This includes working with communication equipment, surveillance gear, and specialized investigative tools. This skill could be crucial for jury-rigging equipment in emergencies.",
      possibleSpecializations: ["Signal Interception", "Surveillance Systems", "Electronic Countermeasures"]
    }
  },
  {
    name: "Robotics",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for programming and technical knowledge
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Electronics", "Computer Use"],
      hasAdvantage: false,
      description: "The ability to operate, program, and maintain robotic systems. This skill involves understanding mechanical engineering, programming, and artificial intelligence principles.",
      possibleSpecializations: ["Drone Operations", "Autonomous System Programming", "Cybernetic Interfaces", "Robotic Exoskeletons"]
    }
  },
  {
    name: "Laboratory Equipment",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for technical protocols
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Electronics"],
      hasAdvantage: false,
      description: "The skill of operating and maintaining sophisticated scientific equipment found in various types of laboratories. This includes understanding protocols, calibrating instruments, and interpreting results.",
      possibleSpecializations: ["Spectrometry", "Genetic Analysis", "Chemical Analysis"]
    }
  },
  {
    name: "Medical Equipment",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for technical operation
      difficulty: "demanding",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Electronics", "Trauma Care"],
      hasAdvantage: false,
      description: "Proficiency in operating and interpreting results from various medical devices and diagnostic equipment. This skill goes beyond basic first aid, involving complex machines like MRI scanners, EEG machines, or advanced life support systems.",
      possibleSpecializations: ["Brain Imaging", "Life Support Systems", "Biomonitoring", "Implants", "Experimental Medical Devices"]
    }
  },
  {
    name: "Security Systems",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "operation",
      governing: "ins", // Insight for system understanding
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: ["Electronics"],
      hasAdvantage: false,
      description: "The ability to operate, bypass, or manipulate various security systems, including alarms, surveillance cameras, and access control mechanisms. This skill involves understanding both electronic and physical security measures.",
      possibleSpecializations: ["CCTV Operations", "Biometric Systems", "Safe Cracking", "Perimeter Defense Systems"]
    }
  }
];

const spiritualSkills = [
  {
    name: "Occultism",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "spiritual",
      governing: "ins", // Insight for esoteric knowledge
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Occultism is the study of hidden, esoteric, or supernatural phenomena. It encompasses a wide range of mystical traditions, paranormal theories, and arcane practices. Practitioners of this skill have knowledge of various occult systems, symbols, and rituals from different cultures and time periods.",
      possibleSpecializations: ["Cryptids", "Folklore", "Rituals"]
    }
  },
  {
    name: "Religion",
    type: "skill",
    img: "icons/svg/mystery-man.svg",
    system: {
      area: "spiritual",
      governing: "ins", // Insight for theological understanding
      difficulty: "average",
      isType: false,
      isPrerequisite: false,
      successNumber: 0,
      specializations: [],
      possibleTypes: [],
      prerequisites: [],
      hasAdvantage: false,
      description: "Religion is the study of organized belief systems, their histories, practices, and spiritual concepts. This skill involves understanding different faiths, their sacred texts, theological arguments, and the impact of religious beliefs on cultures and societies.",
      possibleSpecializations: ["Buddhism", "Christology", "Eschatology", "Gnosticism", "Theosophy"]
    }
  }
];

// Combine all skill arrays
const allSkills = [
  ...athleticsSkills,
  ...attentionSkills,
  ...educationSkills,
  ...fieldcraftSkills,
  ...interpersonalSkills,
  ...martialSkills,
  ...materialCraftsSkills,
  ...medicineSkills,
  ...operationSkills,
  ...spiritualSkills
];

async function createAllSkills() {
  const pack = game.packs.get("core100.skills");
  if (!pack) {
    ui.notifications.error("Could not find the core100.skills compendium pack");
    return;
  }

  console.log(`Creating ${allSkills.length} skills...`);

  for (let skillData of allSkills) {
    try {
      await Item.create(skillData, {pack: pack.collection});
      console.log(`Created skill: ${skillData.name}`);
    } catch (error) {
      console.error(`Error creating skill ${skillData.name}:`, error);
    }
  }

  console.log("Finished creating skills!");
}
