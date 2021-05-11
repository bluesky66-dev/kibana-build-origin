"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespace_type = exports.cursorOrUndefined = exports.cursor = exports.filterOrUndefined = exports.filter = exports.sortOrderOrUndefined = exports.sort_order = exports.sortFieldOrUndefined = exports.sort_field = exports.pageOrUndefined = exports.page = exports.totalUndefined = exports.total = exports.perPageOrUndefined = exports.per_page = exports.itemIdOrUndefined = exports.item_id = exports.list_type = exports.exceptionListItemTypeOrUndefined = exports.exceptionListItemType = exports.ExceptionListTypeEnum = exports.exceptionListTypeOrUndefined = exports.exceptionListType = exports.tagsOrUndefined = exports.tags = exports.esDataTypeUnion = exports.esDataTypeSingle = exports.esDataTypeGeoShape = exports.esDataTypeGeoPoint = exports.geoPointOrUndefined = exports.geo_point = exports.esDataTypeGeoPointRange = exports.esDataTypeRangeTerm = exports.longRangeOrUndefined = exports.long_range = exports.ipRangeOrUndefined = exports.ip_range = exports.integerRangeOrUndefined = exports.integer_range = exports.floatRangeOrUndefined = exports.float_range = exports.doubleRangeOrUndefined = exports.double_range = exports.dateRangeOrUndefined = exports.date_range = exports.esDataTypeRange = exports.metaOrUndefined = exports.meta = exports.typeOrUndefined = exports.type = exports._index = exports.tie_breaker_id = exports.valueOrUndefined = exports.value = exports.shortOrUndefined = exports.short = exports.shapeOrUndefined = exports.shape = exports.longOrUndefined = exports.long = exports.textOrUndefined = exports.text = exports.keywordOrUndefined = exports.keyword = exports.ipOrUndefined = exports.ip = exports.integerOrUndefined = exports.integer = exports.halfFloatOrUndefined = exports.half_float = exports.geoShapeOrUndefined = exports.geo_shape = exports.floatOrUndefined = exports.float = exports.doubleOrUndefined = exports.double = exports.dateNanosOrUndefined = exports.date_nanos = exports.dateOrUndefined = exports.date = exports.byteOrUndefined = exports.byte = exports.booleanOrUndefined = exports.boolean = exports.binaryOrUndefined = exports.binary = exports.idOrUndefined = exports.id = exports.file = exports.created_by = exports.updated_by = exports.updated_at = exports.created_at = exports.item = exports.list_idOrUndefined = exports.list_id = exports.descriptionOrUndefined = exports.description = exports.nameOrUndefined = exports.name = void 0;
exports.osTypeArrayOrUndefined = exports.osTypeArray = exports.osType = exports.immutableOrUndefined = exports.immutable = exports.versionOrUndefined = exports.version = exports._versionOrUndefined = exports._version = exports.deserializerOrUndefined = exports.deserializer = exports.serializerOrUndefined = exports.serializer = exports.OperatorTypeEnum = exports.OperatorEnum = exports.operator = exports.operatorIncluded = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _default_namespace = require("../types/default_namespace");

var _shared_imports = require("../../shared_imports");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const name = t.string;
exports.name = name;
const nameOrUndefined = t.union([name, t.undefined]);
exports.nameOrUndefined = nameOrUndefined;
const description = t.string;
exports.description = description;
const descriptionOrUndefined = t.union([description, t.undefined]);
exports.descriptionOrUndefined = descriptionOrUndefined;
const list_id = _shared_imports.NonEmptyString;
exports.list_id = list_id;
const list_idOrUndefined = t.union([list_id, t.undefined]);
exports.list_idOrUndefined = list_idOrUndefined;
const item = t.string;
exports.item = item;
const created_at = t.string; // TODO: Make this into an ISO Date string check

exports.created_at = created_at;
const updated_at = t.string; // TODO: Make this into an ISO Date string check

exports.updated_at = updated_at;
const updated_by = t.string;
exports.updated_by = updated_by;
const created_by = t.string;
exports.created_by = created_by;
const file = t.object;
exports.file = file;
const id = _shared_imports.NonEmptyString;
exports.id = id;
const idOrUndefined = t.union([id, t.undefined]);
exports.idOrUndefined = idOrUndefined;
const binary = t.string;
exports.binary = binary;
const binaryOrUndefined = t.union([binary, t.undefined]);
exports.binaryOrUndefined = binaryOrUndefined;
const boolean = t.string;
exports.boolean = boolean;
const booleanOrUndefined = t.union([boolean, t.undefined]);
exports.booleanOrUndefined = booleanOrUndefined;
const byte = t.string;
exports.byte = byte;
const byteOrUndefined = t.union([byte, t.undefined]);
exports.byteOrUndefined = byteOrUndefined;
const date = t.string;
exports.date = date;
const dateOrUndefined = t.union([date, t.undefined]);
exports.dateOrUndefined = dateOrUndefined;
const date_nanos = t.string;
exports.date_nanos = date_nanos;
const dateNanosOrUndefined = t.union([date_nanos, t.undefined]);
exports.dateNanosOrUndefined = dateNanosOrUndefined;
const double = t.string;
exports.double = double;
const doubleOrUndefined = t.union([double, t.undefined]);
exports.doubleOrUndefined = doubleOrUndefined;
const float = t.string;
exports.float = float;
const floatOrUndefined = t.union([float, t.undefined]);
exports.floatOrUndefined = floatOrUndefined;
const geo_shape = t.string;
exports.geo_shape = geo_shape;
const geoShapeOrUndefined = t.union([geo_shape, t.undefined]);
exports.geoShapeOrUndefined = geoShapeOrUndefined;
const half_float = t.string;
exports.half_float = half_float;
const halfFloatOrUndefined = t.union([half_float, t.undefined]);
exports.halfFloatOrUndefined = halfFloatOrUndefined;
const integer = t.string;
exports.integer = integer;
const integerOrUndefined = t.union([integer, t.undefined]);
exports.integerOrUndefined = integerOrUndefined;
const ip = t.string;
exports.ip = ip;
const ipOrUndefined = t.union([ip, t.undefined]);
exports.ipOrUndefined = ipOrUndefined;
const keyword = t.string;
exports.keyword = keyword;
const keywordOrUndefined = t.union([keyword, t.undefined]);
exports.keywordOrUndefined = keywordOrUndefined;
const text = t.string;
exports.text = text;
const textOrUndefined = t.union([text, t.undefined]);
exports.textOrUndefined = textOrUndefined;
const long = t.string;
exports.long = long;
const longOrUndefined = t.union([long, t.undefined]);
exports.longOrUndefined = longOrUndefined;
const shape = t.string;
exports.shape = shape;
const shapeOrUndefined = t.union([shape, t.undefined]);
exports.shapeOrUndefined = shapeOrUndefined;
const short = t.string;
exports.short = short;
const shortOrUndefined = t.union([short, t.undefined]);
exports.shortOrUndefined = shortOrUndefined;
const value = t.string;
exports.value = value;
const valueOrUndefined = t.union([value, t.undefined]);
exports.valueOrUndefined = valueOrUndefined;
const tie_breaker_id = t.string; // TODO: Use UUID for this instead of a string for validation

exports.tie_breaker_id = tie_breaker_id;
const _index = t.string;
exports._index = _index;
const type = t.keyof({
  binary: null,
  boolean: null,
  byte: null,
  date: null,
  date_nanos: null,
  date_range: null,
  double: null,
  double_range: null,
  float: null,
  float_range: null,
  geo_point: null,
  geo_shape: null,
  half_float: null,
  integer: null,
  integer_range: null,
  ip: null,
  ip_range: null,
  keyword: null,
  long: null,
  long_range: null,
  shape: null,
  short: null,
  text: null
});
exports.type = type;
const typeOrUndefined = t.union([type, t.undefined]);
exports.typeOrUndefined = typeOrUndefined;
const meta = t.object;
exports.meta = meta;
const metaOrUndefined = t.union([meta, t.undefined]);
exports.metaOrUndefined = metaOrUndefined;
const esDataTypeRange = t.exact(t.type({
  gte: t.string,
  lte: t.string
}));
exports.esDataTypeRange = esDataTypeRange;
const date_range = esDataTypeRange;
exports.date_range = date_range;
const dateRangeOrUndefined = t.union([date_range, t.undefined]);
exports.dateRangeOrUndefined = dateRangeOrUndefined;
const double_range = esDataTypeRange;
exports.double_range = double_range;
const doubleRangeOrUndefined = t.union([double_range, t.undefined]);
exports.doubleRangeOrUndefined = doubleRangeOrUndefined;
const float_range = esDataTypeRange;
exports.float_range = float_range;
const floatRangeOrUndefined = t.union([float_range, t.undefined]);
exports.floatRangeOrUndefined = floatRangeOrUndefined;
const integer_range = esDataTypeRange;
exports.integer_range = integer_range;
const integerRangeOrUndefined = t.union([integer_range, t.undefined]); // ip_range can be just a CIDR value as a range

exports.integerRangeOrUndefined = integerRangeOrUndefined;
const ip_range = t.union([esDataTypeRange, t.string]);
exports.ip_range = ip_range;
const ipRangeOrUndefined = t.union([ip_range, t.undefined]);
exports.ipRangeOrUndefined = ipRangeOrUndefined;
const long_range = esDataTypeRange;
exports.long_range = long_range;
const longRangeOrUndefined = t.union([long_range, t.undefined]);
exports.longRangeOrUndefined = longRangeOrUndefined;
const esDataTypeRangeTerm = t.union([t.exact(t.type({
  date_range
})), t.exact(t.type({
  double_range
})), t.exact(t.type({
  float_range
})), t.exact(t.type({
  integer_range
})), t.exact(t.type({
  ip_range
})), t.exact(t.type({
  long_range
}))]);
exports.esDataTypeRangeTerm = esDataTypeRangeTerm;
const esDataTypeGeoPointRange = t.exact(t.type({
  lat: t.string,
  lon: t.string
}));
exports.esDataTypeGeoPointRange = esDataTypeGeoPointRange;
const geo_point = t.union([esDataTypeGeoPointRange, t.string]);
exports.geo_point = geo_point;
const geoPointOrUndefined = t.union([geo_point, t.undefined]);
exports.geoPointOrUndefined = geoPointOrUndefined;
const esDataTypeGeoPoint = t.exact(t.type({
  geo_point
}));
exports.esDataTypeGeoPoint = esDataTypeGeoPoint;
const esDataTypeGeoShape = t.union([t.exact(t.type({
  geo_shape: t.string
})), t.exact(t.type({
  shape: t.string
}))]);
exports.esDataTypeGeoShape = esDataTypeGeoShape;
const esDataTypeSingle = t.union([t.exact(t.type({
  binary
})), t.exact(t.type({
  boolean
})), t.exact(t.type({
  byte
})), t.exact(t.type({
  date
})), t.exact(t.type({
  date_nanos
})), t.exact(t.type({
  double
})), t.exact(t.type({
  float
})), t.exact(t.type({
  half_float
})), t.exact(t.type({
  integer
})), t.exact(t.type({
  ip
})), t.exact(t.type({
  keyword
})), t.exact(t.type({
  long
})), t.exact(t.type({
  short
})), t.exact(t.type({
  text
}))]);
exports.esDataTypeSingle = esDataTypeSingle;
const esDataTypeUnion = t.union([esDataTypeRangeTerm, esDataTypeGeoPoint, esDataTypeGeoShape, esDataTypeSingle]);
exports.esDataTypeUnion = esDataTypeUnion;
const tags = _shared_imports.DefaultStringArray;
exports.tags = tags;
const tagsOrUndefined = t.union([tags, t.undefined]);
exports.tagsOrUndefined = tagsOrUndefined;
const exceptionListType = t.keyof({
  detection: null,
  endpoint: null
});
exports.exceptionListType = exceptionListType;
const exceptionListTypeOrUndefined = t.union([exceptionListType, t.undefined]);
exports.exceptionListTypeOrUndefined = exceptionListTypeOrUndefined;
let ExceptionListTypeEnum;
exports.ExceptionListTypeEnum = ExceptionListTypeEnum;

(function (ExceptionListTypeEnum) {
  ExceptionListTypeEnum["DETECTION"] = "detection";
  ExceptionListTypeEnum["ENDPOINT"] = "endpoint";
})(ExceptionListTypeEnum || (exports.ExceptionListTypeEnum = ExceptionListTypeEnum = {}));

const exceptionListItemType = t.keyof({
  simple: null
});
exports.exceptionListItemType = exceptionListItemType;
const exceptionListItemTypeOrUndefined = t.union([exceptionListItemType, t.undefined]);
exports.exceptionListItemTypeOrUndefined = exceptionListItemTypeOrUndefined;
const list_type = t.keyof({
  item: null,
  list: null
});
exports.list_type = list_type;
const item_id = _shared_imports.NonEmptyString;
exports.item_id = item_id;
const itemIdOrUndefined = t.union([item_id, t.undefined]);
exports.itemIdOrUndefined = itemIdOrUndefined;
const per_page = t.number; // TODO: Change this out for PositiveNumber from siem

exports.per_page = per_page;
const perPageOrUndefined = t.union([per_page, t.undefined]);
exports.perPageOrUndefined = perPageOrUndefined;
const total = t.number; // TODO: Change this out for PositiveNumber from siem

exports.total = total;
const totalUndefined = t.union([total, t.undefined]);
exports.totalUndefined = totalUndefined;
const page = t.number; // TODO: Change this out for PositiveNumber from siem

exports.page = page;
const pageOrUndefined = t.union([page, t.undefined]);
exports.pageOrUndefined = pageOrUndefined;
const sort_field = t.string;
exports.sort_field = sort_field;
const sortFieldOrUndefined = t.union([sort_field, t.undefined]);
exports.sortFieldOrUndefined = sortFieldOrUndefined;
const sort_order = t.keyof({
  asc: null,
  desc: null
});
exports.sort_order = sort_order;
const sortOrderOrUndefined = t.union([sort_order, t.undefined]);
exports.sortOrderOrUndefined = sortOrderOrUndefined;
const filter = t.string;
exports.filter = filter;
const filterOrUndefined = t.union([filter, t.undefined]);
exports.filterOrUndefined = filterOrUndefined;
const cursor = t.string;
exports.cursor = cursor;
const cursorOrUndefined = t.union([cursor, t.undefined]);
exports.cursorOrUndefined = cursorOrUndefined;
const namespace_type = _default_namespace.DefaultNamespace;
exports.namespace_type = namespace_type;
const operatorIncluded = t.keyof({
  included: null
});
exports.operatorIncluded = operatorIncluded;
const operator = t.keyof({
  excluded: null,
  included: null
});
exports.operator = operator;
let OperatorEnum;
exports.OperatorEnum = OperatorEnum;

(function (OperatorEnum) {
  OperatorEnum["INCLUDED"] = "included";
  OperatorEnum["EXCLUDED"] = "excluded";
})(OperatorEnum || (exports.OperatorEnum = OperatorEnum = {}));

let OperatorTypeEnum;
exports.OperatorTypeEnum = OperatorTypeEnum;

(function (OperatorTypeEnum) {
  OperatorTypeEnum["NESTED"] = "nested";
  OperatorTypeEnum["MATCH"] = "match";
  OperatorTypeEnum["MATCH_ANY"] = "match_any";
  OperatorTypeEnum["EXISTS"] = "exists";
  OperatorTypeEnum["LIST"] = "list";
})(OperatorTypeEnum || (exports.OperatorTypeEnum = OperatorTypeEnum = {}));

const serializer = t.string;
exports.serializer = serializer;
const serializerOrUndefined = t.union([serializer, t.undefined]);
exports.serializerOrUndefined = serializerOrUndefined;
const deserializer = t.string;
exports.deserializer = deserializer;
const deserializerOrUndefined = t.union([deserializer, t.undefined]);
exports.deserializerOrUndefined = deserializerOrUndefined;
const _version = t.string;
exports._version = _version;

const _versionOrUndefined = t.union([_version, t.undefined]);

exports._versionOrUndefined = _versionOrUndefined;
const version = t.number;
exports.version = version;
const versionOrUndefined = t.union([version, t.undefined]);
exports.versionOrUndefined = versionOrUndefined;
const immutable = t.boolean;
exports.immutable = immutable;
const immutableOrUndefined = t.union([immutable, t.undefined]);
exports.immutableOrUndefined = immutableOrUndefined;
const osType = t.keyof({
  linux: null,
  macos: null,
  windows: null
});
exports.osType = osType;
const osTypeArray = (0, _shared_imports.DefaultArray)(osType);
exports.osTypeArray = osTypeArray;
const osTypeArrayOrUndefined = t.union([osTypeArray, t.undefined]);
exports.osTypeArrayOrUndefined = osTypeArrayOrUndefined;