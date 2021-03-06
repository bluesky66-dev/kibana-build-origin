"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeRestoreSettings = serializeRestoreSettings;
exports.deserializeRestoreSettings = deserializeRestoreSettings;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const removeUndefinedSettings = settings => {
  return Object.entries(settings).reduce((sts, [key, value]) => {
    if (value !== undefined) {
      sts[key] = value;
    }

    return sts;
  }, {});
};

function serializeRestoreSettings(restoreSettings) {
  const {
    indices,
    renamePattern,
    renameReplacement,
    includeGlobalState,
    partial,
    indexSettings,
    ignoreIndexSettings,
    ignoreUnavailable
  } = restoreSettings;
  let parsedIndexSettings;

  if (indexSettings) {
    try {
      parsedIndexSettings = JSON.parse(indexSettings);
    } catch (e) {// Silently swallow parsing errors since parsing validation is done on client
      // so we should never reach this point
    }
  }

  const settings = {
    indices,
    rename_pattern: renamePattern,
    rename_replacement: renameReplacement,
    include_global_state: includeGlobalState,
    partial,
    index_settings: parsedIndexSettings,
    ignore_index_settings: ignoreIndexSettings,
    ignore_unavailable: ignoreUnavailable
  };
  return removeUndefinedSettings(settings);
}

function deserializeRestoreSettings(restoreSettingsEs) {
  const {
    indices,
    rename_pattern: renamePattern,
    rename_replacement: renameReplacement,
    include_global_state: includeGlobalState,
    partial,
    index_settings: indexSettings,
    ignore_index_settings: ignoreIndexSettings,
    ignore_unavailable: ignoreUnavailable
  } = restoreSettingsEs;
  const settings = {
    indices,
    renamePattern,
    renameReplacement,
    includeGlobalState,
    partial,
    indexSettings: indexSettings ? JSON.stringify(indexSettings) : undefined,
    ignoreIndexSettings,
    ignoreUnavailable
  };
  return removeUndefinedSettings(settings);
}