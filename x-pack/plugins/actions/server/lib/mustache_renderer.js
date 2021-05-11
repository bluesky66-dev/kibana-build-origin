"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderMustacheString = renderMustacheString;
exports.renderMustacheObject = renderMustacheObject;

var _mustache = _interopRequireDefault(require("mustache"));

var _lodash = require("lodash");

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
// return a rendered mustache template given the specified variables and escape


function renderMustacheString(string, variables, escape) {
  const augmentedVariables = augmentObjectVariables(variables);
  const previousMustacheEscape = _mustache.default.escape;
  _mustache.default.escape = getEscape(escape);

  try {
    return _mustache.default.render(`${string}`, augmentedVariables);
  } catch (err) {
    // log error; the mustache code does not currently leak variables
    return `error rendering mustache template "${string}": ${err.message}`;
  } finally {
    _mustache.default.escape = previousMustacheEscape;
  }
} // return a cloned object with all strings rendered as mustache templates


function renderMustacheObject(params, variables) {
  const augmentedVariables = augmentObjectVariables(variables);
  const result = (0, _lodash.cloneDeepWith)(params, value => {
    if (!(0, _lodash.isString)(value)) return; // since we're rendering a JS object, no escaping needed

    return renderMustacheString(value, augmentedVariables, 'none');
  }); // The return type signature for `cloneDeep()` ends up taking the return
  // type signature for the customizer, but rather than pollute the customizer
  // with casts, seemed better to just do it in one place, here.

  return result;
} // return variables cloned, with a toString() added to objects


function augmentObjectVariables(variables) {
  const result = JSON.parse(JSON.stringify(variables));
  addToStringDeep(result);
  return result;
}

function addToStringDeep(object) {
  // for objects, add a toString method, and then walk
  if (isNonNullObject(object)) {
    if (!object.hasOwnProperty('toString')) {
      object.toString = () => JSON.stringify(object);
    }

    Object.values(object).forEach(value => addToStringDeep(value));
  } // walk arrays, but don't add a toString() as mustache already does something


  if (Array.isArray(object)) {
    object.forEach(element => addToStringDeep(element));
    return;
  }
}

function isNonNullObject(object) {
  if (object == null) return false;
  if (typeof object !== 'object') return false;
  if (!(0, _lodash.isPlainObject)(object)) return false;
  return true;
}

function getEscape(escape) {
  if (escape === 'markdown') return escapeMarkdown;
  if (escape === 'slack') return escapeSlack;
  if (escape === 'json') return escapeJSON;
  return escapeNone;
}

function escapeNone(value) {
  if (value == null) return '';
  return `${value}`;
} // replace with JSON stringified version, removing leading and trailing double quote


function escapeJSON(value) {
  if (value == null) return '';
  const quoted = JSON.stringify(`${value}`); // quoted will always be a string with double quotes, but we don't want the double quotes

  return quoted.substr(1, quoted.length - 2);
} // see: https://api.slack.com/reference/surfaces/formatting
// but in practice, a bit more needs to be escaped, in drastic ways


function escapeSlack(value) {
  if (value == null) return '';
  const valueString = `${value}`; // if the value contains * or _, escape the whole thing with back tics

  if (valueString.includes('_') || valueString.includes('*')) {
    // replace unescapable back tics with single quote
    return '`' + valueString.replace(/`/g, `'`) + '`';
  } // otherwise, do "standard" escaping


  return valueString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // this isn't really standard escaping, but escaping back tics is problematic
  .replace(/`/g, `'`);
} // see: https://www.markdownguide.org/basic-syntax/#characters-you-can-escape


function escapeMarkdown(value) {
  if (value == null) return '';
  return `${value}`.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/{/g, '\\{').replace(/}/g, '\\}').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/#/g, '\\#').replace(/\+/g, '\\+').replace(/-/g, '\\-').replace(/\./g, '\\.').replace(/!/g, '\\!');
}