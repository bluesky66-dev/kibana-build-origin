"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LibStrings = {
  Palettes: {
    getEarthTones: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.earthTonesLabel', {
      defaultMessage: 'Earth Tones'
    }),
    getCanvas: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.canvasLabel', {
      defaultMessage: '{CANVAS}',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getColorBlind: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.colorBlindLabel', {
      defaultMessage: 'Color Blind'
    }),
    getElasticTeal: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticTealLabel', {
      defaultMessage: 'Elastic Teal'
    }),
    getElasticBlue: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticBlueLabel', {
      defaultMessage: 'Elastic Blue'
    }),
    getElasticYellow: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticYellowLabel', {
      defaultMessage: 'Elastic Yellow'
    }),
    getElasticPink: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticPinkLabel', {
      defaultMessage: 'Elastic Pink'
    }),
    getElasticGreen: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticGreenLabel', {
      defaultMessage: 'Elastic Green'
    }),
    getElasticOrange: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticOrangeLabel', {
      defaultMessage: 'Elastic Orange'
    }),
    getElasticPurple: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.elasticPurpleLabel', {
      defaultMessage: 'Elastic Purple'
    }),
    getGreenBlueRed: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.greenBlueRedLabel', {
      defaultMessage: 'Green, Blue, Red'
    }),
    getYellowGreen: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.yellowGreenLabel', {
      defaultMessage: 'Yellow, Green'
    }),
    getYellowBlue: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.yellowBlueLabel', {
      defaultMessage: 'Yellow, Blue'
    }),
    getYellowRed: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.yellowRedLabel', {
      defaultMessage: 'Yellow, Red'
    }),
    getInstagram: () => _i18n.i18n.translate('xpack.canvas.lib.palettes.instagramLabel', {
      defaultMessage: '{INSTAGRAM}',
      values: {
        INSTAGRAM: _constants.INSTAGRAM
      }
    })
  }
};
exports.LibStrings = LibStrings;