"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSavedObjects = exports.savedObjectTypes = void 0;

var _saved_object_mappings = require("./lib/note/saved_object_mappings");

var _saved_object_mappings2 = require("./lib/pinned_event/saved_object_mappings");

var _saved_object_mappings3 = require("./lib/timeline/saved_object_mappings");

var _saved_object_mappings4 = require("./lib/detection_engine/rules/saved_object_mappings");

var _saved_object_mappings5 = require("./lib/detection_engine/rule_actions/saved_object_mappings");

var _saved_objects = require("./lib/detection_engine/migrations/saved_objects");

var _saved_object_mappings6 = require("./endpoint/lib/artifacts/saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const types = [_saved_object_mappings.type, _saved_object_mappings2.type, _saved_object_mappings5.type, _saved_object_mappings4.type, _saved_object_mappings3.type, _saved_object_mappings6.exceptionsArtifactType, _saved_object_mappings6.manifestType, _saved_objects.type];
const savedObjectTypes = types.map(type => type.name);
exports.savedObjectTypes = savedObjectTypes;

const initSavedObjects = savedObjects => {
  types.forEach(type => savedObjects.registerType(type));
};

exports.initSavedObjects = initSavedObjects;