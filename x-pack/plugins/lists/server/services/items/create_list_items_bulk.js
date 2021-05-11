"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListItemsBulk = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("../utils");

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


const createListItemsBulk = async ({
  listId,
  type,
  deserializer,
  serializer,
  value,
  callCluster,
  listItemIndex,
  user,
  meta,
  dateNow,
  tieBreaker
}) => {
  // It causes errors if you try to add items to bulk that do not exist within ES
  if (!value.length) {
    return;
  }

  const body = value.reduce((accum, singleValue, index) => {
    const createdAt = dateNow !== null && dateNow !== void 0 ? dateNow : new Date().toISOString();
    const tieBreakerId = tieBreaker != null && tieBreaker[index] != null ? tieBreaker[index] : _uuid.default.v4();
    const elasticQuery = (0, _utils.transformListItemToElasticQuery)({
      serializer,
      type,
      value: singleValue
    });

    if (elasticQuery != null) {
      const elasticBody = {
        created_at: createdAt,
        created_by: user,
        deserializer,
        list_id: listId,
        meta,
        serializer,
        tie_breaker_id: tieBreakerId,
        updated_at: createdAt,
        updated_by: user,
        ...elasticQuery
      };
      const createBody = {
        create: {
          _index: listItemIndex
        }
      };
      return [...accum, createBody, elasticBody];
    } else {
      // TODO: Report errors with return values from the bulk insert into another index or saved object
      return accum;
    }
  }, []);

  try {
    await callCluster('bulk', {
      body,
      index: listItemIndex,
      refresh: 'wait_for'
    });
  } catch (error) {// TODO: Log out the error with return values from the bulk insert into another index or saved object
  }
};

exports.createListItemsBulk = createListItemsBulk;