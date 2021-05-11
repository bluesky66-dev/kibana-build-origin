"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataSource = getDataSource;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getDataSource(savedObjectsClient, indexPatternId, savedSearchObjectId) {
  let indexPatternSavedObject;
  let searchSource = null;

  if (savedSearchObjectId) {
    try {
      const {
        attributes,
        references
      } = await savedObjectsClient.get('search', savedSearchObjectId);
      searchSource = JSON.parse(attributes.kibanaSavedObjectMeta.searchSourceJSON);
      const {
        id: indexPatternFromSearchId
      } = references.find(({
        type
      }) => type === 'index-pattern');
      ({
        indexPatternSavedObject
      } = await getDataSource(savedObjectsClient, indexPatternFromSearchId));
      return {
        searchSource,
        indexPatternSavedObject
      };
    } catch (err) {
      throw new Error(`Could not get saved search info! ${err}`);
    }
  }

  try {
    const {
      attributes
    } = await savedObjectsClient.get('index-pattern', indexPatternId);
    const {
      fields,
      title,
      timeFieldName
    } = attributes;
    const parsedFields = fields ? JSON.parse(fields) : [];
    indexPatternSavedObject = {
      fields: parsedFields,
      title,
      timeFieldName,
      attributes
    };
  } catch (err) {
    throw new Error(`Could not get index pattern saved object! ${err}`);
  }

  return {
    indexPatternSavedObject,
    searchSource
  };
}