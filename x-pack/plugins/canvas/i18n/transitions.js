"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransitionStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TransitionStrings = {
  fade: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.transitions.fade.displayName', {
      defaultMessage: 'Fade'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.transitions.fade.help', {
      defaultMessage: 'Fade from one page to the next'
    })
  },
  rotate: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.transitions.rotate.displayName', {
      defaultMessage: 'Rotate'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.transitions.rotate.help', {
      defaultMessage: 'Rotate from one page to the next'
    })
  },
  slide: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.transitions.slide.displayName', {
      defaultMessage: 'Slide'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.transitions.slide.help', {
      defaultMessage: 'Slide from one page to the next'
    })
  },
  zoom: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.transitions.zoom.displayName', {
      defaultMessage: 'Zoom'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.transitions.zoom.help', {
      defaultMessage: 'Zoom from one page to the next'
    })
  }
};
exports.TransitionStrings = TransitionStrings;