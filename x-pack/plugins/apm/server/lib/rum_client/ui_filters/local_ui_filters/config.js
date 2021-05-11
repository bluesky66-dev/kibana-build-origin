"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localUIFilters = exports.localUIFilterNames = void 0;

var _ui_filter = require("../../../../../common/ui_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const localUIFilterNames = Object.keys(_ui_filter.filtersByName);
exports.localUIFilterNames = localUIFilterNames;
const localUIFilters = localUIFilterNames.reduce((acc, key) => {
  const field = _ui_filter.filtersByName[key];
  return { ...acc,
    [key]: { ...field,
      name: key
    }
  };
}, {});
exports.localUIFilters = localUIFilters;