"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regenerateIds = void 0;

var _uuid = require("uuid");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Takes an array of saved objects and returns an importIdMap of randomly-generated new IDs.
 *
 * @param objects The saved objects to generate new IDs for.
 */
const regenerateIds = objects => {
  const importIdMap = objects.reduce((acc, object) => {
    return acc.set(`${object.type}:${object.id}`, {
      id: (0, _uuid.v4)(),
      omitOriginId: true
    });
  }, new Map());
  return importIdMap;
};

exports.regenerateIds = regenerateIds;