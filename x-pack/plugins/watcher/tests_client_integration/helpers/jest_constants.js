"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WATCH = exports.WATCH_ID = void 0;

var _fixtures__ = require("../../__fixtures__");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const WATCH_ID = 'my-test-watch';
exports.WATCH_ID = WATCH_ID;
const WATCH = {
  watch: (0, _fixtures__.getWatch)({
    id: WATCH_ID
  })
};
exports.WATCH = WATCH;