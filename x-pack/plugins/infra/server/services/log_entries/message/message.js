"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileFormattingRules = compileFormattingRules;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function compileFormattingRules(rules) {
  const compiledRules = rules.map(compileRule);
  return {
    requiredFields: Array.from(new Set(compiledRules.reduce((combinedRequiredFields, {
      requiredFields
    }) => [...combinedRequiredFields, ...requiredFields], []))),

    format(fields, highlights) {
      for (const compiledRule of compiledRules) {
        if (compiledRule.fulfillsCondition(fields)) {
          return compiledRule.format(fields, highlights);
        }
      }

      return [];
    },

    fulfillsCondition() {
      return true;
    }

  };
}

const compileRule = rule => {
  const {
    conditionFields,
    fulfillsCondition
  } = compileCondition(rule.when);
  const {
    formattingFields,
    format
  } = compileFormattingInstructions(rule.format);
  return {
    requiredFields: [...conditionFields, ...formattingFields],
    fulfillsCondition,
    format
  };
};

const compileCondition = condition => [compileAllCondition, compileExistsCondition, compileExistsPrefixCondition, compileFieldValueCondition].reduce((compiledCondition, compile) => compile(condition) || compiledCondition, falseCondition);

const falseCondition = {
  conditionFields: [],
  fulfillsCondition: () => false
};

const compileAllCondition = condition => {
  if (!('all' in condition)) {
    return null;
  }

  const compiledConditions = condition.all.map(compileCondition);
  return {
    conditionFields: compiledConditions.flatMap(({
      conditionFields
    }) => conditionFields),
    fulfillsCondition: fields => compiledConditions.every(({
      fulfillsCondition
    }) => fulfillsCondition(fields))
  };
};

const compileExistsCondition = condition => 'exists' in condition ? {
  conditionFields: condition.exists,
  fulfillsCondition: fields => condition.exists.every(fieldName => fieldName in fields)
} : null;

const compileExistsPrefixCondition = condition => 'existsPrefix' in condition ? {
  conditionFields: condition.existsPrefix.map(prefix => `${prefix}.*`),
  fulfillsCondition: fields => condition.existsPrefix.every(fieldNamePrefix => Object.keys(fields).some(field => field.startsWith(`${fieldNamePrefix}.`)))
} : null;

const compileFieldValueCondition = condition => 'values' in condition ? {
  conditionFields: Object.keys(condition.values),
  fulfillsCondition: fields => Object.entries(condition.values).every(([fieldName, expectedValue]) => {
    var _fields$fieldName;

    return equalsOrContains((_fields$fieldName = fields[fieldName]) !== null && _fields$fieldName !== void 0 ? _fields$fieldName : [], expectedValue);
  })
} : null;

const compileFormattingInstructions = formattingInstructions => formattingInstructions.reduce((combinedFormattingInstructions, formattingInstruction) => {
  const compiledFormattingInstruction = compileFormattingInstruction(formattingInstruction);
  return {
    formattingFields: [...combinedFormattingInstructions.formattingFields, ...compiledFormattingInstruction.formattingFields],
    format: (fields, highlights) => [...combinedFormattingInstructions.format(fields, highlights), ...compiledFormattingInstruction.format(fields, highlights)]
  };
}, {
  formattingFields: [],
  format: () => []
});

const compileFormattingInstruction = formattingInstruction => [compileFieldReferenceFormattingInstruction, compileFieldsPrefixReferenceFormattingInstruction, compileConstantFormattingInstruction].reduce((compiledFormattingInstruction, compile) => compile(formattingInstruction) || compiledFormattingInstruction, catchAllFormattingInstruction);

const catchAllFormattingInstruction = {
  formattingFields: [],
  format: () => [{
    constant: 'invalid format'
  }]
};

const compileFieldReferenceFormattingInstruction = formattingInstruction => 'field' in formattingInstruction ? {
  formattingFields: [formattingInstruction.field],
  format: (fields, highlights) => {
    var _fields$formattingIns, _highlights$formattin;

    const value = (_fields$formattingIns = fields[formattingInstruction.field]) !== null && _fields$formattingIns !== void 0 ? _fields$formattingIns : [];
    const highlightedValues = (_highlights$formattin = highlights[formattingInstruction.field]) !== null && _highlights$formattin !== void 0 ? _highlights$formattin : [];
    return [{
      field: formattingInstruction.field,
      value,
      highlights: highlightedValues
    }];
  }
} : null;

const compileFieldsPrefixReferenceFormattingInstruction = formattingInstruction => 'fieldsPrefix' in formattingInstruction ? {
  formattingFields: [`${formattingInstruction.fieldsPrefix}.*`],
  format: (fields, highlights) => {
    const matchingFields = Object.keys(fields).filter(field => field.startsWith(`${formattingInstruction.fieldsPrefix}.`));
    return matchingFields.flatMap(field => {
      var _fields$field, _highlights$field;

      const value = (_fields$field = fields[field]) !== null && _fields$field !== void 0 ? _fields$field : [];
      const highlightedValues = (_highlights$field = highlights[field]) !== null && _highlights$field !== void 0 ? _highlights$field : [];
      return [{
        field,
        value,
        highlights: highlightedValues
      }];
    });
  }
} : null;

const compileConstantFormattingInstruction = formattingInstruction => 'constant' in formattingInstruction ? {
  formattingFields: [],
  format: () => [{
    constant: formattingInstruction.constant
  }]
} : null;

const equalsOrContains = (operand, value) => {
  if (Array.isArray(operand)) {
    return operand.includes(value);
  } else if (typeof operand === 'object' && operand !== null) {
    return Object.values(operand).includes(value);
  } else {
    return operand === value;
  }
};