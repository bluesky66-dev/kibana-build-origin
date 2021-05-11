"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalsMigrationService = void 0;

var _create_migration_saved_object = require("./create_migration_saved_object");

var _create_migration = require("./create_migration");

var _finalize_migration = require("./finalize_migration");

var _delete_migration = require("./delete_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const signalsMigrationService = ({
  esClient,
  soClient,
  username
}) => {
  return {
    create: async ({
      index,
      reindexOptions,
      version
    }) => {
      const migrationInfo = await (0, _create_migration.createMigration)({
        esClient,
        index,
        version,
        reindexOptions
      });
      return (0, _create_migration_saved_object.createMigrationSavedObject)({
        attributes: { ...migrationInfo,
          status: 'pending',
          error: null
        },
        soClient,
        username
      });
    },
    finalize: ({
      migration,
      signalsAlias
    }) => (0, _finalize_migration.finalizeMigration)({
      esClient,
      migration,
      signalsAlias,
      soClient,
      username
    }),
    delete: ({
      migration,
      signalsAlias
    }) => (0, _delete_migration.deleteMigration)({
      esClient,
      migration,
      signalsAlias,
      soClient
    })
  };
};

exports.signalsMigrationService = signalsMigrationService;