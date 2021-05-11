"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toExpression = toExpression;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function toExpression(input) {
  var _input$vis, _input$vis2;

  const expressionParts = [];
  expressionParts.push('savedVisualization');
  expressionParts.push(`id="${input.id}"`);

  if (input.title !== undefined) {
    expressionParts.push(`title="${input.title}"`);
  }

  if (input.timeRange) {
    expressionParts.push(`timerange={timerange from="${input.timeRange.from}" to="${input.timeRange.to}"}`);
  }

  if ((_input$vis = input.vis) !== null && _input$vis !== void 0 && _input$vis.colors) {
    Object.entries(input.vis.colors).map(([label, color]) => {
      return `colors={seriesStyle label="${label}" color="${color}"}`;
    }).reduce((_, part) => expressionParts.push(part), 0);
  } // @ts-expect-error LegendOpen missing on VisualizeInput type


  if (((_input$vis2 = input.vis) === null || _input$vis2 === void 0 ? void 0 : _input$vis2.legendOpen) !== undefined && input.vis.legendOpen === false) {
    expressionParts.push(`hideLegend=true`);
  }

  return expressionParts.join(' ');
}