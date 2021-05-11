"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateDefaultFields = exports.addDefaultField = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Adds the index.query.default_field setting, generated from the index's mapping.
 *
 * @param callWithRequest
 * @param request
 * @param indexName
 * @param fieldTypes - Elasticsearch field types that should be used to generate the default_field from the index mapping
 * @param otherFields - Other fields that should be included in the generated default_field that do not match `fieldTypes`
 */


const addDefaultField = async (clusterClient, indexName, fieldTypes, otherFields = new Set()) => {
  // Verify index.query.default_field is not already set.
  const {
    body: settings
  } = await clusterClient.asCurrentUser.indices.getSettings({
    index: indexName
  });

  if ((0, _lodash.get)(settings, `${indexName}.settings.index.query.default_field`)) {
    throw _boom.default.badRequest(`Index ${indexName} already has index.query.default_field set`);
  } // Get the mapping and generate the default_field based on `fieldTypes`


  const {
    body: mappingResp
  } = await clusterClient.asCurrentUser.indices.getMapping({
    index: indexName
  });
  const mapping = mappingResp[indexName].mappings.properties;
  const generatedDefaultFields = new Set(generateDefaultFields(mapping, fieldTypes)); // Update the setting with the generated default_field

  return clusterClient.asCurrentUser.indices.putSettings({
    index: indexName,
    body: {
      index: {
        query: {
          default_field: [...generatedDefaultFields, ...otherFields]
        }
      }
    }
  });
};
/**
 * Recursively walks an index mapping and returns a flat array of dot-delimited
 * strings represent all fields that are of a type included in `DEFAULT_FIELD_TYPES`
 * @param mapping
 */


exports.addDefaultField = addDefaultField;

const generateDefaultFields = (mapping, fieldTypes) => Object.getOwnPropertyNames(mapping).reduce((defaultFields, fieldName) => {
  const {
    type,
    properties
  } = mapping[fieldName];

  if (type && fieldTypes.has(type)) {
    defaultFields.push(fieldName);
  } else if (properties) {
    generateDefaultFields(properties, fieldTypes).forEach(subField => defaultFields.push(`${fieldName}.${subField}`));
  }

  return defaultFields;
}, []);

exports.generateDefaultFields = generateDefaultFields;