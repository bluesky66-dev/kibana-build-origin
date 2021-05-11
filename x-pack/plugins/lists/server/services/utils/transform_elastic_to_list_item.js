"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformElasticHitsToListItem = exports.transformElasticToListItem = void 0;

var _error_with_status_code = require("../../error_with_status_code");

var _encode_hit_version = require("./encode_hit_version");

var _find_source_value = require("./find_source_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformElasticToListItem = ({
  response,
  type
}) => {
  return transformElasticHitsToListItem({
    hits: response.hits.hits,
    type
  });
};

exports.transformElasticToListItem = transformElasticToListItem;

const transformElasticHitsToListItem = ({
  hits,
  type
}) => {
  return hits.map(hit => {
    const {
      _id,
      _source: {
        /* eslint-disable @typescript-eslint/naming-convention */
        created_at,
        deserializer,
        serializer,
        updated_at,
        updated_by,
        created_by,
        list_id,
        tie_breaker_id,
        meta
        /* eslint-enable @typescript-eslint/naming-convention */

      }
    } = hit;
    const value = (0, _find_source_value.findSourceValue)(hit._source);

    if (value == null) {
      throw new _error_with_status_code.ErrorWithStatusCode(`Was expected ${type} to not be null/undefined`, 400);
    } else {
      return {
        _version: (0, _encode_hit_version.encodeHitVersion)(hit),
        created_at,
        created_by,
        deserializer,
        id: _id,
        list_id,
        meta,
        serializer,
        tie_breaker_id,
        type,
        updated_at,
        updated_by,
        value
      };
    }
  });
};

exports.transformElasticHitsToListItem = transformElasticHitsToListItem;