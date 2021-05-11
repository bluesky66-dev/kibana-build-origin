"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterableKbnTypeNames = exports.castEsToKbnFieldTypeName = exports.getKbnTypeNames = exports.getKbnFieldType = void 0;

var _kbn_field_types_factory = require("./kbn_field_types_factory");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @private */
const registeredKbnTypes = (0, _kbn_field_types_factory.createKbnFieldTypes)();
/**
 *  Get a type object by name
 *
 *  @param  {string} typeName
 *  @return {KbnFieldType}
 */

const getKbnFieldType = typeName => registeredKbnTypes.find(t => t.name === typeName) || _kbn_field_types_factory.kbnFieldTypeUnknown;
/**
 *  Get the esTypes known by all kbnFieldTypes
 *
 *  @return {Array<string>}
 */


exports.getKbnFieldType = getKbnFieldType;

const getKbnTypeNames = () => registeredKbnTypes.filter(type => type.name).map(type => type.name);
/**
 *  Get the KbnFieldType name for an esType string
 *
 *  @param {string} esType
 *  @return {string}
 */


exports.getKbnTypeNames = getKbnTypeNames;

const castEsToKbnFieldTypeName = esType => {
  const type = registeredKbnTypes.find(t => t.esTypes.includes(esType));
  return type && type.name ? type.name : _types.KBN_FIELD_TYPES.UNKNOWN;
};
/**
 *  Get filterable KbnFieldTypes
 *
 *  @return {Array<string>}
 */


exports.castEsToKbnFieldTypeName = castEsToKbnFieldTypeName;

const getFilterableKbnTypeNames = () => registeredKbnTypes.filter(type => type.filterable).map(type => type.name);

exports.getFilterableKbnTypeNames = getFilterableKbnTypeNames;