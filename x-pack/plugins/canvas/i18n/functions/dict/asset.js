"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.assetHelpText', {
    defaultMessage: 'Retrieves Canvas workpad asset objects to provide as argument values. Usually images.'
  }),
  args: {
    id: _i18n.i18n.translate('xpack.canvas.functions.asset.args.id', {
      defaultMessage: 'The ID of the asset to retrieve.'
    })
  }
};
exports.help = help;
const errors = {
  invalidAssetId: assetId => new Error(_i18n.i18n.translate('xpack.canvas.functions.asset.invalidAssetId', {
    defaultMessage: "Could not get the asset by ID: '{assetId}'",
    values: {
      assetId
    },
    description: 'This error occurs when there is no asset object associated with the given ID.'
  }))
};
exports.errors = errors;