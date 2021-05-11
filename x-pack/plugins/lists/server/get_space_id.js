"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpaceId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSpaceId = ({
  spaces,
  request
}) => {
  var _spaces$getSpaceId;

  return (_spaces$getSpaceId = spaces === null || spaces === void 0 ? void 0 : spaces.getSpaceId(request)) !== null && _spaces$getSpaceId !== void 0 ? _spaces$getSpaceId : 'default';
};

exports.getSpaceId = getSpaceId;