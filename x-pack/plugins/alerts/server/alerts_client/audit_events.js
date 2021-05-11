"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertAuditEvent = alertAuditEvent;
exports.AlertAuditAction = void 0;

var _server = require("../../../security/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AlertAuditAction;
exports.AlertAuditAction = AlertAuditAction;

(function (AlertAuditAction) {
  AlertAuditAction["CREATE"] = "alert_create";
  AlertAuditAction["GET"] = "alert_get";
  AlertAuditAction["UPDATE"] = "alert_update";
  AlertAuditAction["UPDATE_API_KEY"] = "alert_update_api_key";
  AlertAuditAction["ENABLE"] = "alert_enable";
  AlertAuditAction["DISABLE"] = "alert_disable";
  AlertAuditAction["DELETE"] = "alert_delete";
  AlertAuditAction["FIND"] = "alert_find";
  AlertAuditAction["MUTE"] = "alert_mute";
  AlertAuditAction["UNMUTE"] = "alert_unmute";
  AlertAuditAction["MUTE_INSTANCE"] = "alert_instance_mute";
  AlertAuditAction["UNMUTE_INSTANCE"] = "alert_instance_unmute";
})(AlertAuditAction || (exports.AlertAuditAction = AlertAuditAction = {}));

const eventVerbs = {
  alert_create: ['create', 'creating', 'created'],
  alert_get: ['access', 'accessing', 'accessed'],
  alert_update: ['update', 'updating', 'updated'],
  alert_update_api_key: ['update API key of', 'updating API key of', 'updated API key of'],
  alert_enable: ['enable', 'enabling', 'enabled'],
  alert_disable: ['disable', 'disabling', 'disabled'],
  alert_delete: ['delete', 'deleting', 'deleted'],
  alert_find: ['access', 'accessing', 'accessed'],
  alert_mute: ['mute', 'muting', 'muted'],
  alert_unmute: ['unmute', 'unmuting', 'unmuted'],
  alert_instance_mute: ['mute instance of', 'muting instance of', 'muted instance of'],
  alert_instance_unmute: ['unmute instance of', 'unmuting instance of', 'unmuted instance of']
};
const eventTypes = {
  alert_create: _server.EventType.CREATION,
  alert_get: _server.EventType.ACCESS,
  alert_update: _server.EventType.CHANGE,
  alert_update_api_key: _server.EventType.CHANGE,
  alert_enable: _server.EventType.CHANGE,
  alert_disable: _server.EventType.CHANGE,
  alert_delete: _server.EventType.DELETION,
  alert_find: _server.EventType.ACCESS,
  alert_mute: _server.EventType.CHANGE,
  alert_unmute: _server.EventType.CHANGE,
  alert_instance_mute: _server.EventType.CHANGE,
  alert_instance_unmute: _server.EventType.CHANGE
};

function alertAuditEvent({
  action,
  savedObject,
  outcome,
  error
}) {
  const doc = savedObject ? `alert [id=${savedObject.id}]` : 'an alert';
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