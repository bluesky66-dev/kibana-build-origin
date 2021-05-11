"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNetworkDetailsHostAgg = exports.getNetworkDetailsAgg = void 0;

var _fp = require("lodash/fp");

var _to_array = require("../../../../helpers/to_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNetworkDetailsAgg = (type, networkHit) => {
  const firstSeen = (0, _fp.getOr)(null, `firstSeen.value_as_string`, networkHit);
  const lastSeen = (0, _fp.getOr)(null, `lastSeen.value_as_string`, networkHit);
  const autonomousSystem = (0, _fp.getOr)(null, `as.results.hits.hits[0]._source.${type}.as`, networkHit);
  const geoFields = (0, _fp.getOr)(null, `geo.results.hits.hits[0]._source.${type}.geo`, networkHit);
  return {
    [type]: {
      firstSeen,
      lastSeen,
      autonomousSystem: { ...autonomousSystem
      },
      geo: { ...geoFields
      }
    }
  };
};

exports.getNetworkDetailsAgg = getNetworkDetailsAgg;

const formatHostEcs = data => {
  if (data == null) {
    return null;
  }

  return Object.entries(data).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value != null && !Array.isArray(value)) {
      return { ...acc,
        [key]: formatHostEcs(value)
      };
    }

    return { ...acc,
      [key]: (0, _to_array.toObjectArrayOfStrings)(value).map(({
        str
      }) => str)
    };
  }, {});
};

const getNetworkDetailsHostAgg = hostDetailsHit => {
  const hostFields = formatHostEcs((0, _fp.getOr)(null, `results.hits.hits[0]._source.host`, hostDetailsHit));
  return {
    host: { ...hostFields
    }
  };
};

exports.getNetworkDetailsHostAgg = getNetworkDetailsHostAgg;