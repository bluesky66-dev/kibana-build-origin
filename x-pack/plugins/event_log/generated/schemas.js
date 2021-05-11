"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventSchema = exports.ECS_VERSION = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// ---------------------------------- WARNING ----------------------------------
// this file was generated, and should not be edited by hand
// ---------------------------------- WARNING ----------------------------------
// provides TypeScript and config-schema interfaces for ECS for use with
// the event log


const ECS_VERSION = '1.6.0'; // types and config-schema describing the es structures

exports.ECS_VERSION = ECS_VERSION;

const EventSchema = _configSchema.schema.maybe(_configSchema.schema.object({
  '@timestamp': ecsDate(),
  tags: ecsStringMulti(),
  message: ecsString(),
  ecs: _configSchema.schema.maybe(_configSchema.schema.object({
    version: ecsString()
  })),
  event: _configSchema.schema.maybe(_configSchema.schema.object({
    action: ecsString(),
    provider: ecsString(),
    start: ecsDate(),
    duration: ecsNumber(),
    end: ecsDate(),
    outcome: ecsString(),
    reason: ecsString()
  })),
  error: _configSchema.schema.maybe(_configSchema.schema.object({
    message: ecsString()
  })),
  user: _configSchema.schema.maybe(_configSchema.schema.object({
    name: ecsString()
  })),
  kibana: _configSchema.schema.maybe(_configSchema.schema.object({
    server_uuid: ecsString(),
    alerting: _configSchema.schema.maybe(_configSchema.schema.object({
      instance_id: ecsString(),
      action_group_id: ecsString(),
      action_subgroup: ecsString(),
      status: ecsString()
    })),
    saved_objects: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      rel: ecsString(),
      namespace: ecsString(),
      id: ecsString(),
      type: ecsString()
    })))
  }))
}));

exports.EventSchema = EventSchema;

function ecsStringMulti() {
  return _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()));
}

function ecsString() {
  return _configSchema.schema.maybe(_configSchema.schema.string());
}

function ecsNumber() {
  return _configSchema.schema.maybe(_configSchema.schema.number());
}

function ecsDate() {
  return _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDate
  }));
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function validateDate(isoDate) {
  if (ISO_DATE_PATTERN.test(isoDate)) return;
  return 'string is not a valid ISO date: ' + isoDate;
}