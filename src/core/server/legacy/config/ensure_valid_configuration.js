"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureValidConfiguration = ensureValidConfiguration;

var _get_unused_config_keys = require("./get_unused_config_keys");

var _errors = require("../../errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function ensureValidConfiguration(configService, {
  legacyConfig,
  settings
}) {
  const unusedConfigKeys = await (0, _get_unused_config_keys.getUnusedConfigKeys)({
    coreHandledConfigPaths: await configService.getUsedPaths(),
    settings,
    legacyConfig
  });

  if (unusedConfigKeys.length > 0) {
    const message = `Unknown configuration key(s): ${unusedConfigKeys.map(key => `"${key}"`).join(', ')}. Check for spelling errors and ensure that expected plugins are installed.`;
    throw new InvalidConfigurationError(message);
  }
}

class InvalidConfigurationError extends _errors.CriticalError {
  constructor(message) {
    super(message, 'InvalidConfig', 64);
    Object.setPrototypeOf(this, InvalidConfigurationError.prototype);
  }

}