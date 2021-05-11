"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taggableTypes = exports.tagManagementSectionId = exports.tagSavedObjectTypeName = exports.tagFeatureId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The id of the tagging feature as registered to to `features` plugin
 */

const tagFeatureId = 'savedObjectsTagging';
/**
 * The saved object type for `tag` objects
 */

exports.tagFeatureId = tagFeatureId;
const tagSavedObjectTypeName = 'tag';
/**
 * The management section id as registered to the `management` plugin
 */

exports.tagSavedObjectTypeName = tagSavedObjectTypeName;
const tagManagementSectionId = 'tags';
/**
 * The list of saved object types that are currently supporting tagging.
 */

exports.tagManagementSectionId = tagManagementSectionId;
const taggableTypes = ['dashboard', 'visualization', 'map', 'lens'];
exports.taggableTypes = taggableTypes;