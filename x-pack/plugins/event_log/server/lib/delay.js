"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = delay;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function delay(millis) {
  await new Promise(resolve => setTimeout(resolve, millis));
}