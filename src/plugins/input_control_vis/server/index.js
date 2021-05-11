"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;

const plugin = initializerContext => ({
  setup(core) {
    // TODO this is a workaround to pass global config settings to the client
    // once kibana.autocompleteTerminateAfter and kibana.autocompleteTimeout
    // are migrated completely and owned by a plugin, this can be done completely
    // client side and the additional endpoint is not required anymore
    core.http.createRouter().get({
      path: '/api/input_control_vis/settings',
      validate: false
    }, async (context, request, response) => {
      const legacyConfig = await initializerContext.config.legacy.globalConfig$.pipe((0, _operators.first)()).toPromise();
      return response.ok({
        body: {
          autocompleteTimeout: legacyConfig.kibana.autocompleteTimeout.asMilliseconds(),
          autocompleteTerminateAfter: legacyConfig.kibana.autocompleteTerminateAfter.asMilliseconds()
        }
      });
    });
  },

  start() {}

});

exports.plugin = plugin;