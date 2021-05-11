"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTagsCapabilities = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTagsCapabilities = capabilities => {
  var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _capabilities$savedOb;

  const rawTagCapabilities = capabilities[_constants.tagFeatureId];
  return {
    view: (_ref = rawTagCapabilities === null || rawTagCapabilities === void 0 ? void 0 : rawTagCapabilities.view) !== null && _ref !== void 0 ? _ref : false,
    create: (_ref2 = rawTagCapabilities === null || rawTagCapabilities === void 0 ? void 0 : rawTagCapabilities.create) !== null && _ref2 !== void 0 ? _ref2 : false,
    edit: (_ref3 = rawTagCapabilities === null || rawTagCapabilities === void 0 ? void 0 : rawTagCapabilities.edit) !== null && _ref3 !== void 0 ? _ref3 : false,
    delete: (_ref4 = rawTagCapabilities === null || rawTagCapabilities === void 0 ? void 0 : rawTagCapabilities.delete) !== null && _ref4 !== void 0 ? _ref4 : false,
    assign: (_ref5 = rawTagCapabilities === null || rawTagCapabilities === void 0 ? void 0 : rawTagCapabilities.assign) !== null && _ref5 !== void 0 ? _ref5 : false,
    viewConnections: (_ref6 = (_capabilities$savedOb = capabilities.savedObjectsManagement) === null || _capabilities$savedOb === void 0 ? void 0 : _capabilities$savedOb.read) !== null && _ref6 !== void 0 ? _ref6 : false
  };
};

exports.getTagsCapabilities = getTagsCapabilities;