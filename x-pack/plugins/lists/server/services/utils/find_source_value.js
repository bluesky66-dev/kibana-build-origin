"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeValue = exports.findSourceValue = exports.DEFAULT_VALUE = exports.DEFAULT_LTE_GTE = exports.DEFAULT_DATE_RANGE = exports.DEFAULT_GEO_POINT = void 0;

var _mustache = _interopRequireDefault(require("mustache"));

var _schemas = require("../../../common/schemas");

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


const DEFAULT_GEO_POINT = '{{{lat}}},{{{lon}}}';
exports.DEFAULT_GEO_POINT = DEFAULT_GEO_POINT;
const DEFAULT_DATE_RANGE = '{{{gte}}},{{{lte}}}';
exports.DEFAULT_DATE_RANGE = DEFAULT_DATE_RANGE;
const DEFAULT_LTE_GTE = '{{{gte}}}-{{{lte}}}';
exports.DEFAULT_LTE_GTE = DEFAULT_LTE_GTE;
const DEFAULT_VALUE = '{{{value}}}';
exports.DEFAULT_VALUE = DEFAULT_VALUE;

const findSourceValue = (listItem, types = Object.keys(_schemas.type.keys)) => {
  const foundEntry = Object.entries(listItem).find(([key, value]) => types.includes(key) && value != null);

  if (foundEntry != null) {
    const [foundType, value] = foundEntry;

    switch (foundType) {
      case 'shape':
      case 'geo_shape':
      case 'geo_point':
        {
          return deserializeValue({
            defaultDeserializer: DEFAULT_GEO_POINT,
            defaultValueDeserializer: DEFAULT_VALUE,
            deserializer: listItem.deserializer,
            value
          });
        }

      case 'double_range':
      case 'float_range':
      case 'integer_range':
      case 'long_range':
      case 'ip_range':
        {
          return deserializeValue({
            defaultDeserializer: DEFAULT_LTE_GTE,
            defaultValueDeserializer: DEFAULT_VALUE,
            deserializer: listItem.deserializer,
            value
          });
        }

      case 'date_range':
        {
          return deserializeValue({
            defaultDeserializer: DEFAULT_DATE_RANGE,
            defaultValueDeserializer: DEFAULT_VALUE,
            deserializer: listItem.deserializer,
            value
          });
        }

      default:
        {
          return deserializeValue({
            defaultDeserializer: DEFAULT_VALUE,
            defaultValueDeserializer: DEFAULT_VALUE,
            deserializer: listItem.deserializer,
            value
          });
        }
    }
  } else {
    return null;
  }
};

exports.findSourceValue = findSourceValue;

const deserializeValue = ({
  deserializer,
  defaultValueDeserializer,
  defaultDeserializer,
  value
}) => {
  if (_schemas.esDataTypeRange.is(value)) {
    const template = deserializer !== null && deserializer !== void 0 && deserializer.includes('gte') && deserializer !== null && deserializer !== void 0 && deserializer.includes('lte') ? deserializer : defaultDeserializer;
    const variables = {
      gte: value.gte,
      lte: value.lte
    };
    return _mustache.default.render(template, variables);
  } else if (_schemas.esDataTypeGeoPointRange.is(value)) {
    const template = deserializer !== null && deserializer !== void 0 && deserializer.includes('lat') && deserializer !== null && deserializer !== void 0 && deserializer.includes('lon') ? deserializer : defaultDeserializer;
    const variables = {
      lat: value.lat,
      lon: value.lon
    };
    return _mustache.default.render(template, variables);
  } else if (typeof value === 'string') {
    const template = deserializer !== null && deserializer !== void 0 && deserializer.includes('value') ? deserializer : defaultValueDeserializer;
    const variables = {
      value
    };
    return _mustache.default.render(template, variables);
  } else {
    return null;
  }
};

exports.deserializeValue = deserializeValue;