"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListIfItDoesNotExist = void 0;

var _get_list = require("./get_list");

var _create_list = require("./create_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createListIfItDoesNotExist = async ({
  id,
  name,
  type,
  description,
  deserializer,
  callCluster,
  listIndex,
  user,
  meta,
  serializer,
  dateNow,
  tieBreaker,
  version,
  immutable
}) => {
  const list = await (0, _get_list.getList)({
    callCluster,
    id,
    listIndex
  });

  if (list == null) {
    return (0, _create_list.createList)({
      callCluster,
      dateNow,
      description,
      deserializer,
      id,
      immutable,
      listIndex,
      meta,
      name,
      serializer,
      tieBreaker,
      type,
      user,
      version
    });
  } else {
    return list;
  }
};

exports.createListIfItDoesNotExist = createListIfItDoesNotExist;