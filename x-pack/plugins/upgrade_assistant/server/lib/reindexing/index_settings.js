"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReindexWarnings = exports.generateNewIndexName = exports.sourceNameForIndex = exports.transformFlatSettings = exports.DEFAULT_TYPE_NAME = void 0;

var _lodash = require("lodash");

var _types = require("../../../common/types");

var _apm = require("../apm");

var _version = require("../version");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_TYPE_NAME = '_doc';
exports.DEFAULT_TYPE_NAME = DEFAULT_TYPE_NAME;
/**
 * Validates, and updates deprecated settings and mappings to be applied to the
 * new updated index.
 */

const transformFlatSettings = flatSettings => {
  const settings = transformSettings(flatSettings.settings);
  const mappings = transformMappings(flatSettings.mappings);
  return {
    settings,
    mappings
  };
};
/**
 * Provides the assumed source of the index name stripping any prefixing
 * introduced by the upgrade assistant
 *
 * Examples:
 *   .reindex-v7-foo => .foo
 *   reindex-v7-foo => foo
 *
 * @param indexName
 */


exports.transformFlatSettings = transformFlatSettings;

const sourceNameForIndex = indexName => {
  const matches = indexName.match(/^([\.])?(.*)$/) || [];
  const internal = matches[1] || '';
  const baseName = matches[2]; // in 5.6 the upgrade assistant appended to the index, in 6.7+ we prepend to
  // avoid conflicts with index patterns/templates/etc

  const reindexedMatcher = new RegExp(`(-reindexed-v5$|reindexed-v${_version.versionService.getPrevMajorVersion()}-)`, 'g');
  const cleanBaseName = baseName.replace(reindexedMatcher, '');
  return `${internal}${cleanBaseName}`;
};
/**
 * Provides the index name to re-index into
 *
 * .foo -> .reindexed-v7-foo
 * foo => reindexed-v7-foo
 */


exports.sourceNameForIndex = sourceNameForIndex;

const generateNewIndexName = indexName => {
  const sourceName = sourceNameForIndex(indexName);
  const currentVersion = `reindexed-v${_version.versionService.getMajorVersion()}`;
  return indexName.startsWith('.') ? `.${currentVersion}-${sourceName.substr(1)}` : `${currentVersion}-${sourceName}`;
};
/**
 * Returns an array of warnings that should be displayed to user before reindexing begins.
 * @param flatSettings
 */


exports.generateNewIndexName = generateNewIndexName;

const getReindexWarnings = (flatSettings, apmIndexPatterns = []) => {
  const indexName = flatSettings.settings['index.provided_name'];
  const typeName = Object.getOwnPropertyNames(flatSettings.mappings)[0];
  const apmReindexWarning = (0, _apm.isLegacyApmIndex)(indexName, apmIndexPatterns, flatSettings.mappings[typeName]);
  const typeNameWarning = usesCustomTypeName(flatSettings);
  const warnings = [[_types.ReindexWarning.apmReindex, apmReindexWarning], [_types.ReindexWarning.customTypeName, typeNameWarning]];
  return warnings.filter(([_, applies]) => applies).map(([warning, _]) => warning);
};

exports.getReindexWarnings = getReindexWarnings;

const usesCustomTypeName = flatSettings => {
  // In 7+ it's not possible to have more than one type anyways, so always grab the first
  // (and only) key.
  const typeName = Object.getOwnPropertyNames(flatSettings.mappings)[0];
  return typeName && typeName !== DEFAULT_TYPE_NAME;
};

const removeUnsettableSettings = settings => (0, _lodash.omit)(settings, ['index.uuid', 'index.blocks.write', 'index.creation_date', 'index.legacy', 'index.mapping.single_type', 'index.provided_name', 'index.routing.allocation.initial_recovery._id', 'index.version.created', 'index.version.upgraded', 'index.verified_before_close']); // Use `flow` to pipe the settings through each function.


const transformSettings = (0, _lodash.flow)(removeUnsettableSettings);

const updateFixableMappings = mappings => {
  // TODO: change type to _doc
  return mappings;
};

const transformMappings = (0, _lodash.flow)(updateFixableMappings);