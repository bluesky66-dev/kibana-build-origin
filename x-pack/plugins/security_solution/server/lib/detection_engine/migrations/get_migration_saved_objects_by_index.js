"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrationSavedObjectsByIndex = void 0;

var _find_migration_saved_objects = require("./find_migration_saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a list of migrations SOs for each
 * given signals index.
 *
 * @param soClient An {@link SavedObjectsClientContract}
 * @param index name(s) of the signals index(es)
 *
 * @returns a {@link MigrationsByIndex} object
 *
 * @throws if client returns an error
 */


const getMigrationSavedObjectsByIndex = async ({
  index,
  soClient
}) => {
  const migrationSavedObjects = await (0, _find_migration_saved_objects.findMigrationSavedObjects)({
    soClient,
    options: {
      search: index.join(' OR '),
      searchFields: ['sourceIndex'],
      sortField: 'updated',
      sortOrder: 'desc'
    }
  });
  return migrationSavedObjects.reduce((agg, migration) => {
    var _agg$sourceIndex;

    const {
      sourceIndex
    } = migration.attributes;
    return { ...agg,
      [sourceIndex]: [...((_agg$sourceIndex = agg[sourceIndex]) !== null && _agg$sourceIndex !== void 0 ? _agg$sourceIndex : []), migration]
    };
  }, {});
};

exports.getMigrationSavedObjectsByIndex = getMigrationSavedObjectsByIndex;