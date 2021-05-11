"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.font = void 0;

var _i18n = require("@kbn/i18n");

var _fonts = require("../../fonts");

var _types = require("../../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dashify = str => {
  return str.trim().replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\W/g, m => /[À-ž]/.test(m) ? m : '-').replace(/^-+|-+$/g, '').toLowerCase();
};

const inlineStyle = obj => {
  if (!obj) return '';
  const styles = Object.keys(obj).map(key => {
    const prop = dashify(key);
    const line = prop.concat(':').concat(String(obj[key]));
    return line;
  });
  return styles.join(';');
};

const font = {
  name: 'font',
  aliases: [],
  type: 'style',
  help: _i18n.i18n.translate('expressions.functions.fontHelpText', {
    defaultMessage: 'Create a font style.'
  }),
  inputTypes: ['null'],
  args: {
    align: {
      default: '{ theme "font.align" default="left" }',
      help: _i18n.i18n.translate('expressions.functions.font.args.alignHelpText', {
        defaultMessage: 'The horizontal text alignment.'
      }),
      options: Object.values(_types.TextAlignment),
      types: ['string']
    },
    color: {
      default: `{ theme "font.color" }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.colorHelpText', {
        defaultMessage: 'The text color.'
      }),
      types: ['string']
    },
    family: {
      default: `{ theme "font.family" default="${_fonts.openSans.value}" }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.familyHelpText', {
        defaultMessage: 'An acceptable {css} web font string',
        values: {
          css: 'CSS'
        }
      }),
      types: ['string']
    },
    italic: {
      default: `{ theme "font.italic" default=false }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.italicHelpText', {
        defaultMessage: 'Italicize the text?'
      }),
      options: [true, false],
      types: ['boolean']
    },
    lHeight: {
      default: `{ theme "font.lHeight" }`,
      aliases: ['lineHeight'],
      help: _i18n.i18n.translate('expressions.functions.font.args.lHeightHelpText', {
        defaultMessage: 'The line height in pixels'
      }),
      types: ['number', 'null']
    },
    size: {
      default: `{ theme "font.size" default=14 }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.sizeHelpText', {
        defaultMessage: 'The font size in pixels'
      }),
      types: ['number']
    },
    underline: {
      default: `{ theme "font.underline" default=false }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.underlineHelpText', {
        defaultMessage: 'Underline the text?'
      }),
      options: [true, false],
      types: ['boolean']
    },
    weight: {
      default: `{ theme "font.weight" default="normal" }`,
      help: _i18n.i18n.translate('expressions.functions.font.args.weightHelpText', {
        defaultMessage: 'The font weight. For example, {list}, or {end}.',
        values: {
          list: Object.values(_types.FontWeight).slice(0, -1).map(weight => `\`"${weight}"\``).join(', '),
          end: `\`"${Object.values(_types.FontWeight).slice(-1)[0]}"\``
        }
      }),
      options: Object.values(_types.FontWeight),
      types: ['string']
    }
  },
  fn: (input, args) => {
    if (!Object.values(_types.FontWeight).includes(args.weight)) {
      throw new Error(_i18n.i18n.translate('expressions.functions.font.invalidFontWeightErrorMessage', {
        defaultMessage: "Invalid font weight: '{weight}'",
        values: {
          weight: args.weight
        }
      }));
    }

    if (!Object.values(_types.TextAlignment).includes(args.align)) {
      throw new Error(_i18n.i18n.translate('expressions.functions.font.invalidTextAlignmentErrorMessage', {
        defaultMessage: "Invalid text alignment: '{align}'",
        values: {
          align: args.align
        }
      }));
    } // the line height shouldn't ever be lower than the size, and apply as a
    // pixel setting


    const lineHeight = args.lHeight != null ? `${args.lHeight}px` : '1';
    const spec = {
      fontFamily: args.family,
      fontWeight: args.weight,
      fontStyle: args.italic ? _types.FontStyle.ITALIC : _types.FontStyle.NORMAL,
      textDecoration: args.underline ? _types.TextDecoration.UNDERLINE : _types.TextDecoration.NONE,
      textAlign: args.align,
      fontSize: `${args.size}px`,
      // apply font size as a pixel setting
      lineHeight // apply line height as a pixel setting

    }; // conditionally apply styles based on input

    if (args.color) {
      spec.color = args.color;
    }

    return {
      type: 'style',
      spec,
      css: inlineStyle(spec)
    };
  }
};
exports.font = font;