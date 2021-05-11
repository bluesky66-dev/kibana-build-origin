"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnusedConfigKeys = getUnusedConfigKeys;

var _lodash = require("lodash");

var _std = require("@kbn/std");

var _config = require("../../config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getFlattenedKeys = object => Object.keys((0, _std.getFlattenedObject)(object));

async function getUnusedConfigKeys({
  coreHandledConfigPaths,
  settings,
  legacyConfig
}) {
  const inputKeys = getFlattenedKeys(settings);
  const appliedKeys = getFlattenedKeys(legacyConfig.get());

  if (inputKeys.includes('env')) {
    // env is a special case key, see https://github.com/elastic/kibana/blob/848bf17b/src/legacy/server/config/config.js#L74
    // where it is deleted from the settings before being injected into the schema via context and
    // then renamed to `env.name` https://github.com/elastic/kibana/blob/848bf17/src/legacy/server/config/schema.js#L17
    inputKeys[inputKeys.indexOf('env')] = 'env.name';
  } // Filter out keys that are marked as used in the core (e.g. by new core plugins).


  return (0, _lodash.difference)(inputKeys, appliedKeys).filter(unusedConfigKey => !coreHandledConfigPaths.some(usedInCoreConfigKey => (0, _config.hasConfigPathIntersection)(unusedConfigKey, usedInCoreConfigKey)));
}