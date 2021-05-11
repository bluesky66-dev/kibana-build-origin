"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeIdFromItem = exports.addIdToItem = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

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


const addIdToItem = item => {
  const maybeId = item;

  if (maybeId.id != null) {
    return item;
  } else {
    return { ...item,
      id: _uuid.default.v4()
    };
  }
};
/**
 * This is to reverse the id you added to your arrays for ReactJS keys.
 * @param item The item to remove the id from.
 */


exports.addIdToItem = addIdToItem;

const removeIdFromItem = item => {
  const maybeId = item;

  if (maybeId.id != null) {
    const {
      id,
      ...noId
    } = maybeId;
    return noId;
  } else {
    return item;
  }
};

exports.removeIdFromItem = removeIdFromItem;