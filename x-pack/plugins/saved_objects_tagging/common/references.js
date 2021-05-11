"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTagReferences = exports.replaceTagReferences = exports.tagIdToReference = void 0;

var _lodash = require("lodash");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create a {@link SavedObjectReference | reference} for given tag id.
 */


const tagIdToReference = tagId => ({
  type: _constants.tagSavedObjectTypeName,
  id: tagId,
  name: `tag-ref-${tagId}`
});
/**
 * Update the given `references` array, replacing all the `tag` references with
 * references for the given `newTagIds`, while preserving all references to non-tag objects.
 */


exports.tagIdToReference = tagIdToReference;

const replaceTagReferences = (references, newTagIds) => {
  return [...references.filter(({
    type
  }) => type !== _constants.tagSavedObjectTypeName), ...newTagIds.map(tagIdToReference)];
};
/**
 * Update the given `references` array, adding references to `toAdd` tag ids and removing references
 * to `toRemove` tag ids.
 * All references to non-tag objects will be preserved.
 *
 * @remarks: Having the same id(s) in `toAdd` and `toRemove` will result in an error.
 */


exports.replaceTagReferences = replaceTagReferences;

const updateTagReferences = ({
  references,
  toAdd = [],
  toRemove = []
}) => {
  const duplicates = (0, _lodash.intersection)(toAdd, toRemove);

  if (duplicates.length > 0) {
    throw new Error(`Some ids from 'toAdd' also present in 'toRemove': [${duplicates.join(', ')}]`);
  }

  const nonTagReferences = references.filter(({
    type
  }) => type !== _constants.tagSavedObjectTypeName);
  const newTagIds = (0, _lodash.uniq)([...references.filter(({
    type
  }) => type === _constants.tagSavedObjectTypeName).map(({
    id
  }) => id).filter(id => !toRemove.includes(id)), ...toAdd]);
  return [...nonTagReferences, ...newTagIds.map(tagIdToReference)];
};

exports.updateTagReferences = updateTagReferences;