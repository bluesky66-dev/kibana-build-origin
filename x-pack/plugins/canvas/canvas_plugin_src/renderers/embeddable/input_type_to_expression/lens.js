"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toExpression = toExpression;

var _common = require("@kbn/interpreter/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function toExpression(input, palettes) {
  const expressionParts = [];
  expressionParts.push('savedLens');
  expressionParts.push(`id="${input.id}"`);

  if (input.title !== undefined) {
    expressionParts.push(`title="${input.title}"`);
  }

  if (input.timeRange) {
    expressionParts.push(`timerange={timerange from="${input.timeRange.from}" to="${input.timeRange.to}"}`);
  }

  if (input.palette) {
    expressionParts.push(`palette={${(0, _common.toExpression)(palettes.get(input.palette.name).toExpression(input.palette.params))}}`);
  }

  return expressionParts.join(' ');
}