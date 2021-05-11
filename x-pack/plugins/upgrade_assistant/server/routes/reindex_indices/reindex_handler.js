"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reindexHandler = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../common/types");

var _reindex_actions = require("../../lib/reindexing/reindex_actions");

var _reindexing = require("../../lib/reindexing");

var _error = require("../../lib/reindexing/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const reindexHandler = async ({
  credentialStore,
  dataClient,
  headers,
  indexName,
  licensing,
  log,
  savedObjects,
  reindexOptions
}) => {
  const callAsCurrentUser = dataClient.asCurrentUser;
  const reindexActions = (0, _reindex_actions.reindexActionsFactory)(savedObjects, callAsCurrentUser);
  const reindexService = (0, _reindexing.reindexServiceFactory)(callAsCurrentUser, reindexActions, log, licensing);

  if (!(await reindexService.hasRequiredPrivileges(indexName))) {
    throw _error.error.accessForbidden(_i18n.i18n.translate('xpack.upgradeAssistant.reindex.reindexPrivilegesErrorBatch', {
      defaultMessage: `You do not have adequate privileges to reindex "{indexName}".`,
      values: {
        indexName
      }
    }));
  }

  const existingOp = await reindexService.findReindexOperation(indexName); // If the reindexOp already exists and it's paused, resume it. Otherwise create a new one.

  const reindexOp = existingOp && existingOp.attributes.status === _types.ReindexStatus.paused ? await reindexService.resumeReindexOperation(indexName, reindexOptions) : await reindexService.createReindexOperation(indexName, reindexOptions); // Add users credentials for the worker to use

  credentialStore.set(reindexOp, headers);
  return reindexOp.attributes;
};

exports.reindexHandler = reindexHandler;