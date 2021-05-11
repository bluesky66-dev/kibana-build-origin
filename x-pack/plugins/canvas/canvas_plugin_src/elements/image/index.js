"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const image = () => ({
  name: 'image',
  displayName: 'Image',
  type: 'image',
  help: 'A static image',
  icon: 'image',
  expression: `image dataurl=null mode="contain"
| render`
});

exports.image = image;