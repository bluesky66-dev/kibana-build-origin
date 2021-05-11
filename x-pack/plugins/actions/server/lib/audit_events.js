"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectorAuditEvent = connectorAuditEvent;
exports.ConnectorAuditAction = void 0;

var _server = require("../../../security/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let ConnectorAuditAction;
exports.ConnectorAuditAction = ConnectorAuditAction;

(function (ConnectorAuditAction) {
  ConnectorAuditAction["CREATE"] = "connector_create";
  ConnectorAuditAction["GET"] = "connector_get";
  ConnectorAuditAction["UPDATE"] = "connector_update";
  ConnectorAuditAction["DELETE"] = "connector_delete";
  ConnectorAuditAction["FIND"] = "connector_find";
  ConnectorAuditAction["EXECUTE"] = "connector_execute";
})(ConnectorAuditAction || (exports.ConnectorAuditAction = ConnectorAuditAction = {}));

const eventVerbs = {
  connector_create: ['create', 'creating', 'created'],
  connector_get: ['access', 'accessing', 'accessed'],
  connector_update: ['update', 'updating', 'updated'],
  connector_delete: ['delete', 'deleting', 'deleted'],
  connector_find: ['access', 'accessing', 'accessed'],
  connector_execute: ['execute', 'executing', 'executed']
};
const eventTypes = {
  connector_create: _server.EventType.CREATION,
  connector_get: _server.EventType.ACCESS,
  connector_update: _server.EventType.CHANGE,
  connector_delete: _server.EventType.DELETION,
  connector_find: _server.EventType.ACCESS,
  connector_execute: undefined
};

function connectorAuditEvent({
  action,
  savedObject,
  outcome,
  error
}) {
  const doc = savedObject ? `connector [id=${savedObject.id}]` : 'a connector';
  const [present, progressive, past] = eventVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === _server.EventOutcome.UNKNOWN ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = eventTypes[action];
  return {
    message,
    event: {
      action,
      category: _server.EventCategory.DATABASE,
      type,
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? _server.EventOutcome.FAILURE : _server.EventOutcome.SUCCESS
    },
    kibana: {
      saved_object: savedObject
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}