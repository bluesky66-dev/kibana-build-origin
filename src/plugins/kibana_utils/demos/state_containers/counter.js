"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.result = void 0;

var _state_containers = require("../../common/state_containers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const container = (0, _state_containers.createStateContainer)({
  count: 0
}, {
  increment: state => by => ({
    count: state.count + by
  }),
  double: state => () => ({
    count: state.count * 2
  })
}, {
  count: state => () => state.count
});
container.transitions.increment(5);
container.transitions.double();
console.log(container.selectors.count()); // eslint-disable-line

const result = container.selectors.count();
exports.result = result;