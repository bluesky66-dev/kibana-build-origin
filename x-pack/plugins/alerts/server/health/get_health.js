"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealth = void 0;

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getHealth = async internalSavedObjectsRepository => {
  const healthStatuses = {
    decryptionHealth: {
      status: _types.HealthStatus.OK,
      timestamp: ''
    },
    executionHealth: {
      status: _types.HealthStatus.OK,
      timestamp: ''
    },
    readHealth: {
      status: _types.HealthStatus.OK,
      timestamp: ''
    }
  };
  const {
    saved_objects: decryptErrorData
  } = await internalSavedObjectsRepository.find({
    filter: `alert.attributes.executionStatus.status:error and alert.attributes.executionStatus.error.reason:${_types.AlertExecutionStatusErrorReasons.Decrypt}`,
    fields: ['executionStatus'],
    type: 'alert',
    sortField: 'executionStatus.lastExecutionDate',
    sortOrder: 'desc',
    page: 1,
    perPage: 1
  });

  if (decryptErrorData.length > 0) {
    healthStatuses.decryptionHealth = {
      status: _types.HealthStatus.Warning,
      timestamp: decryptErrorData[0].attributes.executionStatus.lastExecutionDate
    };
  }

  const {
    saved_objects: executeErrorData
  } = await internalSavedObjectsRepository.find({
    filter: `alert.attributes.executionStatus.status:error and alert.attributes.executionStatus.error.reason:${_types.AlertExecutionStatusErrorReasons.Execute}`,
    fields: ['executionStatus'],
    type: 'alert',
    sortField: 'executionStatus.lastExecutionDate',
    sortOrder: 'desc',
    page: 1,
    perPage: 1
  });

  if (executeErrorData.length > 0) {
    healthStatuses.executionHealth = {
      status: _types.HealthStatus.Warning,
      timestamp: executeErrorData[0].attributes.executionStatus.lastExecutionDate
    };
  }

  const {
    saved_objects: readErrorData
  } = await internalSavedObjectsRepository.find({
    filter: `alert.attributes.executionStatus.status:error and alert.attributes.executionStatus.error.reason:${_types.AlertExecutionStatusErrorReasons.Read}`,
    fields: ['executionStatus'],
    type: 'alert',
    sortField: 'executionStatus.lastExecutionDate',
    sortOrder: 'desc',
    page: 1,
    perPage: 1
  });

  if (readErrorData.length > 0) {
    healthStatuses.readHealth = {
      status: _types.HealthStatus.Warning,
      timestamp: readErrorData[0].attributes.executionStatus.lastExecutionDate
    };
  }

  const {
    saved_objects: noErrorData
  } = await internalSavedObjectsRepository.find({
    filter: 'not alert.attributes.executionStatus.status:error',
    fields: ['executionStatus'],
    type: 'alert',
    sortField: 'executionStatus.lastExecutionDate',
    sortOrder: 'desc'
  });
  const lastExecutionDate = noErrorData.length > 0 ? noErrorData[0].attributes.executionStatus.lastExecutionDate : new Date().toISOString();

  for (const [, statusItem] of Object.entries(healthStatuses)) {
    if (statusItem.status === _types.HealthStatus.OK) {
      statusItem.timestamp = lastExecutionDate;
    }
  }

  return healthStatuses;
};

exports.getHealth = getHealth;