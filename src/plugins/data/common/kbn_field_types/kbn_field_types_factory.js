"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKbnFieldTypes = exports.kbnFieldTypeUnknown = void 0;

var _kbn_field_type = require("./kbn_field_type");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kbnFieldTypeUnknown = new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.UNKNOWN
});
exports.kbnFieldTypeUnknown = kbnFieldTypeUnknown;

const createKbnFieldTypes = () => [new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.STRING,
  sortable: true,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.STRING, _types.ES_FIELD_TYPES.TEXT, _types.ES_FIELD_TYPES.KEYWORD, _types.ES_FIELD_TYPES._TYPE, _types.ES_FIELD_TYPES._ID]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.NUMBER,
  sortable: true,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.FLOAT, _types.ES_FIELD_TYPES.HALF_FLOAT, _types.ES_FIELD_TYPES.SCALED_FLOAT, _types.ES_FIELD_TYPES.DOUBLE, _types.ES_FIELD_TYPES.INTEGER, _types.ES_FIELD_TYPES.LONG, _types.ES_FIELD_TYPES.UNSIGNED_LONG, _types.ES_FIELD_TYPES.SHORT, _types.ES_FIELD_TYPES.BYTE, _types.ES_FIELD_TYPES.TOKEN_COUNT]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.DATE,
  sortable: true,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.DATE, _types.ES_FIELD_TYPES.DATE_NANOS]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.IP,
  sortable: true,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.IP]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.BOOLEAN,
  sortable: true,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.BOOLEAN]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.OBJECT,
  esTypes: [_types.ES_FIELD_TYPES.OBJECT]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.NESTED,
  esTypes: [_types.ES_FIELD_TYPES.NESTED]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.GEO_POINT,
  esTypes: [_types.ES_FIELD_TYPES.GEO_POINT]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.GEO_SHAPE,
  esTypes: [_types.ES_FIELD_TYPES.GEO_SHAPE]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.ATTACHMENT,
  esTypes: [_types.ES_FIELD_TYPES.ATTACHMENT]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.MURMUR3,
  esTypes: [_types.ES_FIELD_TYPES.MURMUR3]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES._SOURCE,
  esTypes: [_types.ES_FIELD_TYPES._SOURCE]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.HISTOGRAM,
  filterable: true,
  esTypes: [_types.ES_FIELD_TYPES.HISTOGRAM]
}), new _kbn_field_type.KbnFieldType({
  name: _types.KBN_FIELD_TYPES.CONFLICT
}), kbnFieldTypeUnknown];

exports.createKbnFieldTypes = createKbnFieldTypes;