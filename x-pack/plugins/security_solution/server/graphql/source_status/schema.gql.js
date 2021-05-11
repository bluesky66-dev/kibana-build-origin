"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceStatusSchema = void 0;

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

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


const sourceStatusSchema = (0, _graphqlTag.default)`
  scalar ToIFieldSubTypeNonNullable

  "A descriptor of a field in an index"
  type IndexField {
    "Where the field belong"
    category: String!
    "Example of field's value"
    example: String
    "whether the field's belong to an alias index"
    indexes: [String]!
    "The name of the field"
    name: String!
    "The type of the field's values as recognized by Kibana"
    type: String!
    "Whether the field's values can be efficiently searched for"
    searchable: Boolean!
    "Whether the field's values can be aggregated"
    aggregatable: Boolean!
    "Description of the field"
    description: String
    format: String
    "the elastic type as mapped in the index"
    esTypes: ToStringArrayNoNullable
    subType: ToIFieldSubTypeNonNullable
  }

  extend type SourceStatus {
    "Whether the configured alias or wildcard pattern resolve to any auditbeat indices"
    indicesExist(defaultIndex: [String!]!): Boolean!
    "The list of fields defined in the index mappings"
    indexFields(defaultIndex: [String!]!): [String!]!
  }
`;
exports.sourceStatusSchema = sourceStatusSchema;