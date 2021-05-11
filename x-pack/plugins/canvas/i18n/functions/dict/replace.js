"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.replaceImageHelpText', {
    defaultMessage: 'Uses a regular expression to replace parts of a string.'
  }),
  args: {
    pattern: _i18n.i18n.translate('xpack.canvas.functions.replace.args.patternHelpText', {
      defaultMessage: 'The text or pattern of a {JS} regular expression. For example, {example}. You can use capturing groups here.',
      values: {
        JS: _constants.JS,
        example: '`"[aeiou]"`'
      }
    }),
    flags: _i18n.i18n.translate('xpack.canvas.functions.replace.args.flagsHelpText', {
      defaultMessage: 'Specify flags. See {url}.',
      values: {
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp'
      }
    }),
    replacement: _i18n.i18n.translate('xpack.canvas.functions.replace.args.replacementHelpText', {
      defaultMessage: 'The replacement for the matching parts of string. Capturing groups can be accessed by their index. For example, {example}.',
      values: {
        example: '`"$1"`'
      }
    })
  }
};
exports.help = help;