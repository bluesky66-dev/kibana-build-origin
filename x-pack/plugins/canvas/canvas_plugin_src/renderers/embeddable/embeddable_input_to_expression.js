"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddableInputToExpression = embeddableInputToExpression;
exports.inputToExpressionTypeMap = void 0;

var _expression_types = require("../../expression_types");

var _map = require("./input_type_to_expression/map");

var _visualization = require("./input_type_to_expression/visualization");

var _lens = require("./input_type_to_expression/lens");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const inputToExpressionTypeMap = {
  [_expression_types.EmbeddableTypes.map]: _map.toExpression,
  [_expression_types.EmbeddableTypes.visualization]: _visualization.toExpression,
  [_expression_types.EmbeddableTypes.lens]: _lens.toExpression
};
/*
  Take the input from an embeddable and the type of embeddable and convert it into an expression
*/

exports.inputToExpressionTypeMap = inputToExpressionTypeMap;

function embeddableInputToExpression(input, embeddableType, palettes) {
  if (inputToExpressionTypeMap[embeddableType]) {
    return inputToExpressionTypeMap[embeddableType](input, palettes);
  }
}