"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findIndexPatternById = exports.getFieldByName = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getFieldByName = (fieldName, indexPattern) => {
  const fields = indexPattern && JSON.parse(indexPattern.attributes.fields);
  const field = fields && fields.find(f => f.name === fieldName);
  return field;
};

exports.getFieldByName = getFieldByName;

const findIndexPatternById = async (savedObjectsClient, index) => {
  const savedObjectsResponse = await savedObjectsClient.find({
    type: 'index-pattern',
    fields: ['fields'],
    search: `"${index}"`,
    searchFields: ['title']
  });

  if (savedObjectsResponse.total > 0) {
    return savedObjectsResponse.saved_objects[0];
  }
};

exports.findIndexPatternById = findIndexPatternById;