"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMigration = void 0;

var _delete_migration_saved_object = require("./delete_migration_saved_object");

var _helpers = require("./helpers");

var _migration_cleanup = require("./migration_cleanup");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Deletes a completed migration:
 *   * deletes the migration SO
 *   * deletes the underlying task document
 *   * applies deletion policy to the relevant index
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param soClient An {@link SavedObjectsClientContract}
 * @param migration the migration to be finalized {@link SignalsMigrationSO}
 * @param signalsAlias the alias for signals indices
 *
 * @returns the migration SavedObject {@link SignalsMigrationSO}
 * @throws if the migration is invalid or a client throws
 */


const deleteMigration = async ({
  esClient,
  migration,
  signalsAlias,
  soClient
}) => {
  if ((0, _helpers.isMigrationPending)(migration)) {
    return migration;
  }

  const {
    destinationIndex,
    sourceIndex,
    taskId
  } = migration.attributes;

  if ((0, _helpers.isMigrationFailed)(migration)) {
    await (0, _migration_cleanup.applyMigrationCleanupPolicy)({
      alias: signalsAlias,
      esClient,
      index: destinationIndex
    });
  }

  if ((0, _helpers.isMigrationSuccess)(migration)) {
    await (0, _migration_cleanup.applyMigrationCleanupPolicy)({
      alias: signalsAlias,
      esClient,
      index: sourceIndex
    });
  }

  await esClient.delete({
    index: '.tasks',
    id: taskId
  });
  await (0, _delete_migration_saved_object.deleteMigrationSavedObject)({
    id: migration.id,
    soClient
  });
  return migration;
};

exports.deleteMigration = deleteMigration;