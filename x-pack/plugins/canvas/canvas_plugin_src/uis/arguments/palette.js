"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.palette = exports.PaletteArgInput = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _common = require("@kbn/interpreter/common");

var _palette_picker = require("../../../public/components/palette_picker");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _i18n = require("../../../i18n");

var _lib = require("../../../common/lib");

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


const {
  Palette: strings
} = _i18n.ArgumentStrings;

const PaletteArgInput = ({
  onValueChange,
  argId,
  argValue,
  renderError
}) => {
  // TODO: This is weird, its basically a reimplementation of what the interpretter would return.
  // Probably a better way todo this, and maybe a better way to handle template type objects in general?
  const astToPalette = ({
    chain
  }) => {
    if (chain.length !== 1 || chain[0].function !== 'palette') {
      renderError();
      return null;
    }

    try {
      const colors = chain[0].arguments._.map(astObj => {
        if ((0, _common.getType)(astObj) !== 'string') {
          renderError();
        }

        return astObj;
      });

      const gradient = (0, _lodash.get)(chain[0].arguments.gradient, '[0]');
      const palette = (0, _lib.identifyPalette)({
        colors,
        gradient
      });

      if (palette) {
        return palette;
      }

      return {
        id: 'custom',
        label: strings.getCustomPaletteLabel(),
        colors,
        gradient
      };
    } catch (e) {
      renderError();
    }

    return null;
  };

  const handleChange = palette => {
    const astObj = {
      type: 'expression',
      chain: [{
        type: 'function',
        function: 'palette',
        arguments: {
          _: palette.colors,
          gradient: [palette.gradient]
        }
      }]
    };
    onValueChange(astObj);
  };

  const palette = astToPalette(argValue);

  if (!palette) {
    renderError();
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_palette_picker.PalettePicker, {
    id: argId,
    palette: palette,
    onChange: handleChange
  });
};

exports.PaletteArgInput = PaletteArgInput;
PaletteArgInput.propTypes = {
  argId: _propTypes.default.string,
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.any.isRequired,
  renderError: _propTypes.default.func
};

const palette = () => ({
  name: 'palette',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  default: '{palette #882E72 #B178A6 #D6C1DE #1965B0 #5289C7 #7BAFDE #4EB265 #90C987 #CAE0AB #F7EE55 #F6C141 #F1932D #E8601C #DC050C}',
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(PaletteArgInput)
});

exports.palette = palette;