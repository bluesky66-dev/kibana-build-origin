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
  help: _i18n.i18n.translate('xpack.canvas.functions.markdownHelpText', {
    defaultMessage: 'Adds an element that renders {MARKDOWN} text. TIP: Use the {markdownFn} function for single numbers, metrics, and paragraphs of text.',
    values: {
      MARKDOWN: _constants.MARKDOWN,
      markdownFn: '`markdown`'
    }
  }),
  args: {
    content: _i18n.i18n.translate('xpack.canvas.functions.markdown.args.contentHelpText', {
      defaultMessage: 'A string of text that contains {MARKDOWN}. To concatenate, pass the {stringFn} function multiple times.',
      values: {
        MARKDOWN: _constants.MARKDOWN,
        stringFn: '`string`'
      }
    }),
    font: _i18n.i18n.translate('xpack.canvas.functions.markdown.args.fontHelpText', {
      defaultMessage: 'The {CSS} font properties for the content. For example, {fontFamily} or {fontWeight}.',
      values: {
        CSS: _constants.CSS,
        fontFamily: '"font-family"',
        fontWeight: '"font-weight"'
      }
    }),
    openLinksInNewTab: _i18n.i18n.translate('xpack.canvas.functions.markdown.args.openLinkHelpText', {
      defaultMessage: 'A true or false value for opening links in a new tab. The default value is `false`. Setting to `true` opens all links in a new tab.'
    })
  }
};
exports.help = help;