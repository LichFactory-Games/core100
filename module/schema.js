// schema.js
export const SKILL_AREAS = {
  athletics: "Athletics",
  attention: "Attention",
  education: "Education",
  fieldcraft: "Fieldcraft",
  interpersonal: "Interpersonal",
  martial: "Martial",
  materialCrafts: "Material Crafts",
  medicine: "Medicine",
  operation: "Operation",
  spiritual: "Spiritual"
};

export const DIFFICULTIES = {
  average: "Average",
  demanding: "Demanding"
};

export const ATTRIBUTES = {
  vgr: "Vigor",
  grc: "Grace",
  ins: "Insight",
  prs: "Presence"
};

/**
 * The template for a skill item
 */
export const skillTemplate = {
  name: "",
  type: "skill",
  system: {
    area: "",
    governing: "",
    difficulty: "average",
    successNumber: 0,
    specializations: [],
    hasAdvantage: false,
    description: ""
  }
};

/**
 * System data schema
 */
export const CORE100_SCHEMA = {
  Item: {
    skill: {
      templates: ["base"],
      area: {
        type: String,
        required: true,
        default: ""
      },
      governing: {
        type: String,
        required: true,
        default: ""
      },
      difficulty: {
        type: String,
        required: true,
        default: "average",
        validate: v => ["average", "demanding"].includes(v)
      },
      successNumber: {
        type: Number,
        required: true,
        default: 0
      },
      specializations: {
        type: Array,
        required: true,
        default: []
      },
      hasAdvantage: {
        type: Boolean,
        required: true,
        default: false
      },
      description: {
        type: String,
        required: true,
        default: ""
      }
    }
  }
};