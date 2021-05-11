"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExecutionEnqueuerFunction = createExecutionEnqueuerFunction;

var _saved_objects = require("./saved_objects");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createExecutionEnqueuerFunction({
  taskManager,
  actionTypeRegistry,
  isESOCanEncrypt,
  preconfiguredActions
}) {
  return async function execute(unsecuredSavedObjectsClient, {
    id,
    params,
    spaceId,
    source,
    apiKey
  }) {
    if (!isESOCanEncrypt) {
      throw new Error(`Unable to execute action because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
    }

    const actionTypeId = await getActionTypeId(unsecuredSavedObjectsClient, preconfiguredActions, id);

    if (!actionTypeRegistry.isActionExecutable(id, actionTypeId, {
      notifyUsage: true
    })) {
      actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    }

    const actionTaskParamsRecord = await unsecuredSavedObjectsClient.create(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, {
      actionId: id,
      params,
      apiKey
    }, executionSourceAsSavedObjectReferences(source));
    await taskManager.schedule({
      taskType: `actions:${actionTypeId}`,
      params: {
        spaceId,
        actionTaskParamsId: actionTaskParamsRecord.id
      },
      state: {},
      scope: ['actions']
    });
  };
}

function executionSourceAsSavedObjectReferences(executionSource) {
  return (0, _lib.isSavedObjectExecutionSource)(executionSource) ? {
    references: [{
      name: 'source',
      ...executionSource.source
    }]
  } : {};
}

async function getActionTypeId(unsecuredSavedObjectsClient, preconfiguredActions, actionId) {
  const pcAction = preconfiguredActions.find(action => action.id === actionId);

  if (pcAction) {
    return pcAction.actionTypeId;
  }

  const {
    attributes: {
      actionTypeId
    }
  } = await unsecuredSavedObjectsClient.get('action', actionId);
  return actionTypeId;
}