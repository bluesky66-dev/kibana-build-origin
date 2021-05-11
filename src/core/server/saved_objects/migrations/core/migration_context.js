"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrationContext = migrationContext;
exports.disableUnknownTypeMappingFields = disableUnknownTypeMappingFields;

var _build_active_mappings = require("./build_active_mappings");

var Index = _interopRequireWildcard(require("./elastic_index"));

var _migration_logger = require("./migration_logger");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The MigrationOpts interface defines the minimum set of data required
 * in order to properly migrate an index. MigrationContext expands this
 * with computed values and values from the index being migrated, and is
 * serves as a central blueprint for what migrations will end up doing.
 */

/**
 * Builds up an uber object which has all of the config options, settings,
 * and various info needed to migrate the source index.
 */
async function migrationContext(opts) {
  const {
    log,
    client
  } = opts;
  const alias = opts.index;
  const source = createSourceContext(await Index.fetchInfo(client, alias), alias);
  const dest = createDestContext(source, alias, opts.mappingProperties);
  return {
    client,
    alias,
    source,
    dest,
    kibanaVersion: opts.kibanaVersion,
    log: new _migration_logger.MigrationLogger(log),
    batchSize: opts.batchSize,
    documentMigrator: opts.documentMigrator,
    pollInterval: opts.pollInterval,
    scrollDuration: opts.scrollDuration,
    serializer: opts.serializer,
    obsoleteIndexTemplatePattern: opts.obsoleteIndexTemplatePattern,
    convertToAliasScript: opts.convertToAliasScript
  };
}

function createSourceContext(source, alias) {
  if (source.exists && source.indexName === alias) {
    return { ...source,
      indexName: nextIndexName(alias, alias)
    };
  }

  return source;
}

function createDestContext(source, alias, typeMappingDefinitions) {
  const targetMappings = disableUnknownTypeMappingFields((0, _build_active_mappings.buildActiveMappings)(typeMappingDefinitions), source.mappings);
  return {
    aliases: {},
    exists: false,
    indexName: nextIndexName(source.indexName, alias),
    mappings: targetMappings
  };
}
/**
 * Merges the active mappings and the source mappings while disabling the
 * fields of any unknown Saved Object types present in the source index's
 * mappings.
 *
 * Since the Saved Objects index has `dynamic: strict` defined at the
 * top-level, only Saved Object types for which a mapping exists can be
 * inserted into the index. To ensure that we can continue to store Saved
 * Object documents belonging to a disabled plugin we define a mapping for all
 * the unknown Saved Object types that were present in the source index's
 * mappings. To limit the field count as much as possible, these unkwnown
 * type's mappings are set to `dynamic: false`.
 *
 * (Since we're using the source index mappings instead of looking at actual
 * document types in the inedx, we potentially add more "unknown types" than
 * what would be necessary to support migrating all the data over to the
 * target index.)
 *
 * @param activeMappings The mappings compiled from all the Saved Object types
 * known to this Kibana node.
 * @param sourceMappings The mappings of index used as the migration source.
 * @returns The mappings that should be applied to the target index.
 */


function disableUnknownTypeMappingFields(activeMappings, sourceMappings) {
  const targetTypes = Object.keys(activeMappings.properties);
  const disabledTypesProperties = Object.keys(sourceMappings.properties).filter(sourceType => {
    const isObjectType = ('properties' in sourceMappings.properties[sourceType]); // Only Object/Nested datatypes can be excluded from the field count by
    // using `dynamic: false`.

    return !targetTypes.includes(sourceType) && isObjectType;
  }).reduce((disabledTypesAcc, sourceType) => {
    disabledTypesAcc[sourceType] = {
      dynamic: false,
      properties: {}
    };
    return disabledTypesAcc;
  }, {});
  return { ...activeMappings,
    properties: { ...sourceMappings.properties,
      ...disabledTypesProperties,
      ...activeMappings.properties
    }
  };
}
/**
 * Gets the next index name in a sequence, based on specified current index's info.
 * We're using a numeric counter to create new indices. So, `.kibana_1`, `.kibana_2`, etc
 * There are downsides to this, but it seemed like a simple enough approach.
 */


function nextIndexName(indexName, alias) {
  const indexSuffix = (indexName.match(/[\d]+$/) || [])[0];
  const indexNum = parseInt(indexSuffix, 10) || 0;
  return `${alias}_${indexNum + 1}`;
}