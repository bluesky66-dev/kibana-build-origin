"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMappings = void 0;

var _api = require("../../../common/api");

var _saved_objects = require("../../../../actions/server/saved_objects");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const getMappings = async ({
  savedObjectsClient,
  connectorMappingsService,
  actionsClient,
  caseClient,
  connectorType,
  connectorId,
  logger
}) => {
  try {
    if (connectorType === _api.ConnectorTypes.none) {
      return [];
    }

    const myConnectorMappings = await connectorMappingsService.find({
      client: savedObjectsClient,
      options: {
        hasReference: {
          type: _saved_objects.ACTION_SAVED_OBJECT_TYPE,
          id: connectorId
        }
      }
    });
    let theMapping; // Create connector mappings if there are none

    if (myConnectorMappings.total === 0) {
      const res = await caseClient.getFields({
        actionsClient,
        connectorId,
        connectorType
      });
      theMapping = await connectorMappingsService.post({
        client: savedObjectsClient,
        attributes: {
          mappings: res.defaultMappings
        },
        references: [{
          type: _saved_objects.ACTION_SAVED_OBJECT_TYPE,
          name: `associated-${_saved_objects.ACTION_SAVED_OBJECT_TYPE}`,
          id: connectorId
        }]
      });
    } else {
      theMapping = myConnectorMappings.saved_objects[0];
    }

    return theMapping ? theMapping.attributes.mappings : [];
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to retrieve mapping connector id: ${connectorId} type: ${connectorType}: ${error}`,
      error,
      logger
    });
  }
};

exports.getMappings = getMappings;