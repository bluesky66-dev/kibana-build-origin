"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeSingleValue = exports.serializeRanges = exports.serializeIpRange = exports.serializeGeoPoint = exports.serializeGeoShape = exports.transformListItemToElasticQuery = exports.DEFAULT_SINGLE_REGEX = exports.DEFAULT_GEO_REGEX = exports.DEFAULT_LTE_GTE_REGEX = exports.DEFAULT_DATE_REGEX = void 0;

var _schemas = require("../../../common/schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_DATE_REGEX = RegExp('(?<gte>.+),(?<lte>.+)|(?<value>.+)');
exports.DEFAULT_DATE_REGEX = DEFAULT_DATE_REGEX;
const DEFAULT_LTE_GTE_REGEX = RegExp('(?<gte>.+)-(?<lte>.+)|(?<value>.+)');
exports.DEFAULT_LTE_GTE_REGEX = DEFAULT_LTE_GTE_REGEX;
const DEFAULT_GEO_REGEX = RegExp('(?<lat>.+),(?<lon>.+)');
exports.DEFAULT_GEO_REGEX = DEFAULT_GEO_REGEX;
const DEFAULT_SINGLE_REGEX = RegExp('(?<value>.+)');
exports.DEFAULT_SINGLE_REGEX = DEFAULT_SINGLE_REGEX;

const transformListItemToElasticQuery = ({
  serializer,
  type,
  value
}) => {
  switch (type) {
    case 'shape':
    case 'geo_shape':
      {
        return serializeGeoShape({
          defaultSerializer: DEFAULT_GEO_REGEX,
          serializer,
          type,
          value
        });
      }

    case 'geo_point':
      {
        return serializeGeoPoint({
          defaultSerializer: DEFAULT_GEO_REGEX,
          serializer,
          value
        });
      }

    case 'ip_range':
      {
        return serializeIpRange({
          defaultSerializer: DEFAULT_LTE_GTE_REGEX,
          serializer,
          value
        });
      }

    case 'date_range':
      {
        return serializeRanges({
          defaultSerializer: DEFAULT_DATE_REGEX,
          serializer,
          type,
          value
        });
      }

    case 'double_range':
    case 'float_range':
    case 'integer_range':
    case 'long_range':
      {
        return serializeRanges({
          defaultSerializer: DEFAULT_LTE_GTE_REGEX,
          serializer,
          type,
          value
        });
      }

    default:
      {
        return serializeSingleValue({
          defaultSerializer: DEFAULT_SINGLE_REGEX,
          serializer,
          type,
          value
        });
      }
  }
};

exports.transformListItemToElasticQuery = transformListItemToElasticQuery;

const serializeGeoShape = ({
  defaultSerializer,
  serializer,
  value,
  type
}) => {
  var _parsed$groups, _parsed$groups2;

  const regExpSerializer = serializer != null ? RegExp(serializer) : defaultSerializer;
  const parsed = regExpSerializer.exec(value.trim()); // we only support lat/lon for point and represent it as Well Known Text (WKT)

  if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups = parsed.groups) === null || _parsed$groups === void 0 ? void 0 : _parsed$groups.lat) != null && (parsed === null || parsed === void 0 ? void 0 : (_parsed$groups2 = parsed.groups) === null || _parsed$groups2 === void 0 ? void 0 : _parsed$groups2.lon) != null) {
    const unionType = {
      [type]: `POINT (${parsed.groups.lon.trim()} ${parsed.groups.lat.trim()})`
    };

    if (_schemas.esDataTypeGeoShape.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  } else {
    // This should be in Well Known Text (WKT) at this point so let's return it as is
    const unionType = {
      [type]: value.trim()
    };

    if (_schemas.esDataTypeGeoShape.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  }
};

exports.serializeGeoShape = serializeGeoShape;

const serializeGeoPoint = ({
  defaultSerializer,
  serializer,
  value
}) => {
  var _parsed$groups3, _parsed$groups4;

  const regExpSerializer = serializer != null ? RegExp(serializer) : defaultSerializer;
  const parsed = regExpSerializer.exec(value.trim());

  if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups3 = parsed.groups) === null || _parsed$groups3 === void 0 ? void 0 : _parsed$groups3.lat) != null && (parsed === null || parsed === void 0 ? void 0 : (_parsed$groups4 = parsed.groups) === null || _parsed$groups4 === void 0 ? void 0 : _parsed$groups4.lon) != null) {
    return {
      geo_point: {
        lat: parsed.groups.lat.trim(),
        lon: parsed.groups.lon.trim()
      }
    };
  } else {
    // This might be in Well Known Text (WKT) so let's return it as is
    return {
      geo_point: value.trim()
    };
  }
};

exports.serializeGeoPoint = serializeGeoPoint;

const serializeIpRange = ({
  defaultSerializer,
  serializer,
  value
}) => {
  var _parsed$groups5, _parsed$groups6, _parsed$groups7;

  const regExpSerializer = serializer != null ? RegExp(serializer) : defaultSerializer;
  const parsed = regExpSerializer.exec(value.trim());

  if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups5 = parsed.groups) === null || _parsed$groups5 === void 0 ? void 0 : _parsed$groups5.lte) != null && (parsed === null || parsed === void 0 ? void 0 : (_parsed$groups6 = parsed.groups) === null || _parsed$groups6 === void 0 ? void 0 : _parsed$groups6.gte) != null) {
    return {
      ip_range: {
        gte: parsed.groups.gte.trim(),
        lte: parsed.groups.lte.trim()
      }
    };
  } else if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups7 = parsed.groups) === null || _parsed$groups7 === void 0 ? void 0 : _parsed$groups7.value) != null) {
    // This is a CIDR string based on the serializer involving value such as (?<value>.+)
    if (parsed.groups.value.includes('/')) {
      return {
        ip_range: parsed.groups.value.trim()
      };
    } else {
      return {
        ip_range: {
          gte: parsed.groups.value.trim(),
          lte: parsed.groups.value.trim()
        }
      };
    }
  } else {
    return null;
  }
};

exports.serializeIpRange = serializeIpRange;

const serializeRanges = ({
  type,
  serializer,
  value,
  defaultSerializer
}) => {
  var _parsed$groups8, _parsed$groups9, _parsed$groups10;

  const regExpSerializer = serializer != null ? RegExp(serializer) : defaultSerializer;
  const parsed = regExpSerializer.exec(value.trim());

  if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups8 = parsed.groups) === null || _parsed$groups8 === void 0 ? void 0 : _parsed$groups8.lte) != null && (parsed === null || parsed === void 0 ? void 0 : (_parsed$groups9 = parsed.groups) === null || _parsed$groups9 === void 0 ? void 0 : _parsed$groups9.gte) != null) {
    const unionType = {
      [type]: {
        gte: parsed.groups.gte.trim(),
        lte: parsed.groups.lte.trim()
      }
    };

    if (_schemas.esDataTypeRangeTerm.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  } else if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups10 = parsed.groups) === null || _parsed$groups10 === void 0 ? void 0 : _parsed$groups10.value) != null) {
    const unionType = {
      [type]: {
        gte: parsed.groups.value.trim(),
        lte: parsed.groups.value.trim()
      }
    };

    if (_schemas.esDataTypeRangeTerm.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.serializeRanges = serializeRanges;

const serializeSingleValue = ({
  serializer,
  value,
  defaultSerializer,
  type
}) => {
  var _parsed$groups11;

  const regExpSerializer = serializer != null ? RegExp(serializer) : defaultSerializer;
  const parsed = regExpSerializer.exec(value.trim());

  if ((parsed === null || parsed === void 0 ? void 0 : (_parsed$groups11 = parsed.groups) === null || _parsed$groups11 === void 0 ? void 0 : _parsed$groups11.value) != null) {
    const unionType = {
      [type]: `${parsed.groups.value.trim()}`
    };

    if (_schemas.esDataTypeSingle.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  } else {
    const unionType = {
      [type]: value
    };

    if (_schemas.esDataTypeSingle.is(unionType)) {
      return unionType;
    } else {
      return null;
    }
  }
};

exports.serializeSingleValue = serializeSingleValue;