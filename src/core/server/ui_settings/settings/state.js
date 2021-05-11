"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStateSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getStateSettings = () => {
  return {
    'state:storeInSessionStorage': {
      name: _i18n.i18n.translate('core.ui_settings.params.storeUrlTitle', {
        defaultMessage: 'Store URLs in session storage'
      }),
      value: false,
      description: _i18n.i18n.translate('core.ui_settings.params.storeUrlText', {
        defaultMessage: 'The URL can sometimes grow to be too large for some browsers to handle. ' + 'To counter-act this we are testing if storing parts of the URL in session storage could help. ' + 'Please let us know how it goes!'
      }),
      schema: _configSchema.schema.boolean()
    }
  };
};

exports.getStateSettings = getStateSettings;