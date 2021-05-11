"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArgTypesStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ArgTypesStrings = {
  Color: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.colorDisplayName', {
      defaultMessage: 'Color'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.colorHelp', {
      defaultMessage: 'Color picker'
    })
  },
  ContainerStyle: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyleTitle', {
      defaultMessage: 'Container style'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyleLabel', {
      defaultMessage: 'Tweak the appearance of the element container'
    }),
    getAppearanceTitle: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.appearanceTitle', {
      defaultMessage: 'Appearance'
    }),
    getBorderTitle: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.borderTitle', {
      defaultMessage: 'Border'
    }),
    getPaddingLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.paddingLabel', {
      defaultMessage: 'Padding'
    }),
    getOpacityLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.opacityLabel', {
      defaultMessage: 'Opacity'
    }),
    getOverflowLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.overflowLabel', {
      defaultMessage: 'Overflow'
    }),
    getOverflowHiddenOption: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.overflowHiddenDropDown', {
      defaultMessage: 'Hidden'
    }),
    getOverflowVisibleOption: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.overflowVisibleDropDown', {
      defaultMessage: 'Visible'
    }),
    getThicknessLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.thicknessLabel', {
      defaultMessage: 'Thickness'
    }),
    getStyleLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.styleLabel', {
      defaultMessage: 'Style'
    }),
    getRadiusLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.radiusLabel', {
      defaultMessage: 'Radius'
    }),
    getColorLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.containerStyle.colorLabel', {
      defaultMessage: 'Color'
    })
  },
  Font: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.fontTitle', {
      defaultMessage: 'Text settings'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.fontHelpLabel', {
      defaultMessage: 'Set the font, size and color'
    })
  },
  SeriesStyle: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyleTitle', {
      defaultMessage: 'Series style'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyleLabel', {
      defaultMessage: 'Set the style for a selected named series'
    }),
    getColorLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.colorLabel', {
      defaultMessage: 'Color'
    }),
    getColorValueDefault: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.colorValueDefault', {
      defaultMessage: 'Auto'
    }),
    getStyleLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.styleLabel', {
      defaultMessage: 'Style'
    }),
    getRemoveAriaLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.removeAriaLabel', {
      defaultMessage: 'Remove series color'
    }),
    getNoSeriesTooltip: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.noSeriesTooltip', {
      defaultMessage: 'Data has no series to style, add a color dimension'
    }),
    getSeriesIdentifierLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.seriesIdentifierLabel', {
      defaultMessage: 'Series id'
    }),
    getSelectSeriesOption: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.selectSeriesDropDown', {
      defaultMessage: 'Select series'
    }),
    getLineLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.lineLabel', {
      defaultMessage: 'Line'
    }),
    getBarLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.barLabel', {
      defaultMessage: 'Bar'
    }),
    getPointLabel: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.pointLabel', {
      defaultMessage: 'Point'
    }),
    getNoneOption: () => _i18n.i18n.translate('xpack.canvas.expressionTypes.argTypes.seriesStyle.noneDropDown', {
      defaultMessage: 'None'
    })
  }
};
exports.ArgTypesStrings = ArgTypesStrings;