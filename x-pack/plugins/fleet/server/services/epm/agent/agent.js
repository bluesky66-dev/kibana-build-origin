"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileTemplate = compileTemplate;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _jsYaml = require("js-yaml");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const handlebars = _handlebars.default.create();

function compileTemplate(variables, templateStr) {
  const {
    vars,
    yamlValues
  } = buildTemplateVariables(variables, templateStr);
  const template = handlebars.compile(templateStr, {
    noEscape: true
  });
  let compiledTemplate = template(vars);
  compiledTemplate = replaceRootLevelYamlVariables(yamlValues, compiledTemplate);
  const yamlFromCompiledTemplate = (0, _jsYaml.safeLoad)(compiledTemplate, {}); // Hack to keep empty string ('') values around in the end yaml because
  // `safeLoad` replaces empty strings with null

  const patchedYamlFromCompiledTemplate = Object.entries(yamlFromCompiledTemplate).reduce((acc, [key, value]) => {
    if (value === null && typeof vars[key] === 'string' && vars[key].trim() === '') {
      acc[key] = '';
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
  return replaceVariablesInYaml(yamlValues, patchedYamlFromCompiledTemplate);
}

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

function replaceVariablesInYaml(yamlVariables, yaml) {
  if (Object.keys(yamlVariables).length === 0 || !yaml) {
    return yaml;
  }

  Object.entries(yaml).forEach(([key, value]) => {
    if (typeof value === 'object') {
      yaml[key] = replaceVariablesInYaml(yamlVariables, value);
    }

    if (typeof value === 'string' && value in yamlVariables) {
      yaml[key] = yamlVariables[value];
    }
  });
  return yaml;
}

const maybeEscapeString = value => {
  // Numeric strings need to be quoted to stay strings.
  if (value.length && !isNaN(+value)) {
    return `"${value}"`;
  }

  return value;
};

function buildTemplateVariables(variables, templateStr) {
  const yamlValues = {};
  const vars = Object.entries(variables).reduce((acc, [key, recordEntry]) => {
    var _recordEntry$value; // support variables with . like key.patterns


    const keyParts = key.split('.');
    const lastKeyPart = keyParts.pop();

    if (!lastKeyPart || !isValidKey(lastKeyPart)) {
      throw new Error('Invalid key');
    }

    let varPart = acc;

    for (const keyPart of keyParts) {
      if (!isValidKey(keyPart)) {
        throw new Error('Invalid key');
      }

      if (!varPart[keyPart]) {
        varPart[keyPart] = {};
      }

      varPart = varPart[keyPart];
    }

    if (recordEntry.type && recordEntry.type === 'yaml') {
      const yamlKeyPlaceholder = `##${key}##`;
      varPart[lastKeyPart] = `"${yamlKeyPlaceholder}"`;
      yamlValues[yamlKeyPlaceholder] = recordEntry.value ? (0, _jsYaml.safeLoad)(recordEntry.value) : null;
    } else if (recordEntry.type && (recordEntry.type === 'text' || recordEntry.type === 'string') && (_recordEntry$value = recordEntry.value) !== null && _recordEntry$value !== void 0 && _recordEntry$value.length) {
      if (Array.isArray(recordEntry.value)) {
        varPart[lastKeyPart] = recordEntry.value.map(value => maybeEscapeString(value));
      } else {
        varPart[lastKeyPart] = maybeEscapeString(recordEntry.value);
      }
    } else {
      varPart[lastKeyPart] = recordEntry.value;
    }

    return acc;
  }, {});
  return {
    vars,
    yamlValues
  };
}

function containsHelper(item, list, options) {
  if (Array.isArray(list) && list.includes(item)) {
    if (options && options.fn) {
      return options.fn(this);
    }
  }

  return '';
}

handlebars.registerHelper('contains', containsHelper);

function replaceRootLevelYamlVariables(yamlVariables, yamlTemplate) {
  if (Object.keys(yamlVariables).length === 0 || !yamlTemplate) {
    return yamlTemplate;
  }

  let patchedTemplate = yamlTemplate;
  Object.entries(yamlVariables).forEach(([key, val]) => {
    patchedTemplate = patchedTemplate.replace(new RegExp(`^"${key}"`, 'gm'), val ? (0, _jsYaml.safeDump)(val) : '');
  });
  return patchedTemplate;
}