"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateList = void 0;

var _decode_version = require("../utils/decode_version");

var _encode_hit_version = require("../utils/encode_hit_version");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateList = async ({
  _version,
  id,
  name,
  description,
  callCluster,
  listIndex,
  user,
  meta,
  dateNow,
  version
}) => {
  const updatedAt = dateNow !== null && dateNow !== void 0 ? dateNow : new Date().toISOString();
  const list = await (0, _.getList)({
    callCluster,
    id,
    listIndex
  });

  if (list == null) {
    return null;
  } else {
    const calculatedVersion = version == null ? list.version + 1 : version;
    const doc = {
      description,
      meta,
      name,
      updated_at: updatedAt,
      updated_by: user
    };
    const response = await callCluster('update', { ...(0, _decode_version.decodeVersion)(_version),
      body: {
        doc
      },
      id,
      index: listIndex,
      refresh: 'wait_for'
    });
    return {
      _version: (0, _encode_hit_version.encodeHitVersion)(response),
      created_at: list.created_at,
      created_by: list.created_by,
      description: description !== null && description !== void 0 ? description : list.description,
      deserializer: list.deserializer,
      id: response._id,
      immutable: list.immutable,
      meta,
      name: name !== null && name !== void 0 ? name : list.name,
      serializer: list.serializer,
      tie_breaker_id: list.tie_breaker_id,
      type: list.type,
      updated_at: updatedAt,
      updated_by: user,
      version: calculatedVersion
    };
  }
};

exports.updateList = updateList;