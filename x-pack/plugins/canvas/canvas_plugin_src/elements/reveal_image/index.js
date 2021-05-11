"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revealImage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const revealImage = () => ({
  name: 'revealImage',
  displayName: 'Image reveal',
  type: 'image',
  help: 'Reveals a percentage of an image',
  expression: `filters
| demodata
| math "mean(percent_uptime)"
| revealImage origin=bottom image=null
| render`
});

exports.revealImage = revealImage;