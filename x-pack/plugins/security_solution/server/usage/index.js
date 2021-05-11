"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUsageCollectors = void 0;

var _collector = require("./collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initUsageCollectors = dependencies => {
  (0, _collector.registerCollector)(dependencies);
};

exports.initUsageCollectors = initUsageCollectors;