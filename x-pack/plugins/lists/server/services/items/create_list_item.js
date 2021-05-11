"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListItem = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("../utils");

var _encode_hit_version = require("../utils/encode_hit_version");

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


const createListItem = async ({
  deserializer,
  id,
  serializer,
  listId,
  type,
  value,
  callCluster,
  listItemIndex,
  user,
  meta,
  dateNow,
  tieBreaker
}) => {
  const createdAt = dateNow !== null && dateNow !== void 0 ? dateNow : new Date().toISOString();
  const tieBreakerId = tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4();
  const baseBody = {
    created_at: createdAt,
    created_by: user,
    deserializer,
    list_id: listId,
    meta,
    serializer,
    tie_breaker_id: tieBreakerId,
    updated_at: createdAt,
    updated_by: user
  };
  const elasticQuery = (0, _utils.transformListItemToElasticQuery)({
    serializer,
    type,
    value
  });

  if (elasticQuery != null) {
    const body = { ...baseBody,
      ...elasticQuery
    };
    const response = await callCluster('index', {
      body,
      id,
      index: listItemIndex,
      refresh: 'wait_for'
    });
    return {
      _version: (0, _encode_hit_version.encodeHitVersion)(response),
      id: response._id,
      type,
      value,
      ...baseBody
    };
  } else {
    return null;
  }
};

exports.createListItem = createListItem;