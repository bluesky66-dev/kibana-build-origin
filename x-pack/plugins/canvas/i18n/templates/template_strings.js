"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function will return a dictionary of strings, organized by Canvas
 * Element specification.  This function requires that `i18nProvider` be
 * properly initialized.
 */


const getTemplateStrings = () => ({
  Dark: {
    name: _i18n.i18n.translate('xpack.canvas.templates.darkName', {
      defaultMessage: 'Dark'
    }),
    help: _i18n.i18n.translate('xpack.canvas.templates.darkHelp', {
      defaultMessage: 'Dark color themed presentation deck'
    })
  },
  Light: {
    name: _i18n.i18n.translate('xpack.canvas.templates.lightName', {
      defaultMessage: 'Light'
    }),
    help: _i18n.i18n.translate('xpack.canvas.templates.lightHelp', {
      defaultMessage: 'Light color themed presentation deck'
    })
  },
  Status: {
    name: _i18n.i18n.translate('xpack.canvas.templates.statusName', {
      defaultMessage: 'Status'
    }),
    help: _i18n.i18n.translate('xpack.canvas.templates.statusHelp', {
      defaultMessage: 'Document-style report with live charts'
    })
  },
  Summary: {
    name: _i18n.i18n.translate('xpack.canvas.templates.summaryDisplayName', {
      defaultMessage: 'Summary'
    }),
    help: _i18n.i18n.translate('xpack.canvas.templates.summaryHelp', {
      defaultMessage: 'Infographic-style report with live charts'
    })
  },
  Pitch: {
    name: _i18n.i18n.translate('xpack.canvas.templates.pitchName', {
      defaultMessage: 'Pitch'
    }),
    help: _i18n.i18n.translate('xpack.canvas.templates.pitchHelp', {
      defaultMessage: 'Branded presentation with large photos'
    })
  }
});

exports.getTemplateStrings = getTemplateStrings;