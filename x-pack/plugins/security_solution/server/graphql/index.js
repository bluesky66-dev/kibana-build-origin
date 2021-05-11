"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemas = void 0;

var _root = require("../../common/graphql/root");

var _shared = require("../../common/graphql/shared");

var _ecs = require("./ecs");

var _hosts = require("./hosts");

var _scalar_date = require("./scalar_date");

var _note = require("./note");

var _pinned_event = require("./pinned_event");

var _scalar_to_any = require("./scalar_to_any");

var _scalar_to_boolean_array = require("./scalar_to_boolean_array");

var _scalar_to_date_array = require("./scalar_to_date_array");

var _scalar_to_number_array = require("./scalar_to_number_array");

var _source_status = require("./source_status");

var _sources = require("./sources");

var _timeline = require("./timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const schemas = [_ecs.ecsSchema, _scalar_date.dateSchema, _scalar_to_any.toAnySchema, _scalar_to_number_array.toNumberSchema, _scalar_to_date_array.toDateSchema, _scalar_to_boolean_array.toBooleanSchema, _hosts.hostsSchema, _note.noteSchema, _pinned_event.pinnedEventSchema, _root.rootSchema, _sources.sourcesSchema, _source_status.sourceStatusSchema, _shared.sharedSchema, _timeline.timelineSchema];
exports.schemas = schemas;