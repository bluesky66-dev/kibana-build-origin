"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateReservedPrivileges = validateReservedPrivileges;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateReservedPrivileges(features) {
  const seenPrivilegeIds = new Set();

  for (const feature of features) {
    var _feature$reserved$pri, _feature$reserved;

    ((_feature$reserved$pri = feature === null || feature === void 0 ? void 0 : (_feature$reserved = feature.reserved) === null || _feature$reserved === void 0 ? void 0 : _feature$reserved.privileges) !== null && _feature$reserved$pri !== void 0 ? _feature$reserved$pri : []).forEach(({
      id
    }) => {
      if (seenPrivilegeIds.has(id)) {
        throw new Error(`Duplicate reserved privilege id detected: ${id}. This is not allowed.`);
      }

      seenPrivilegeIds.add(id);
    });
  }
}