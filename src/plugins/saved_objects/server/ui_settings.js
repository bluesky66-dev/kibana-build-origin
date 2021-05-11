"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uiSettings = {
  [_common.PER_PAGE_SETTING]: {
    name: _i18n.i18n.translate('savedObjects.advancedSettings.perPageTitle', {
      defaultMessage: 'Objects per page'
    }),
    value: 20,
    type: 'number',
    description: _i18n.i18n.translate('savedObjects.advancedSettings.perPageText', {
      defaultMessage: 'Number of objects to show per page in the load dialog'
    }),
    schema: _configSchema.schema.number()
  },
  [_common.LISTING_LIMIT_SETTING]: {
    name: _i18n.i18n.translate('savedObjects.advancedSettings.listingLimitTitle', {
      defaultMessage: 'Objects listing limit'
    }),
    type: 'number',
    value: 1000,
    description: _i18n.i18n.translate('savedObjects.advancedSettings.listingLimitText', {
      defaultMessage: 'Number of objects to fetch for the listing pages'
    }),
    schema: _configSchema.schema.number()
  }
};
exports.uiSettings = uiSettings;