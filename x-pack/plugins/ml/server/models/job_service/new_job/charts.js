"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newJobChartsProvider = newJobChartsProvider;

var _line_chart = require("./line_chart");

var _population_chart = require("./population_chart");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function newJobChartsProvider(client) {
  const {
    newJobLineChart
  } = (0, _line_chart.newJobLineChartProvider)(client);
  const {
    newJobPopulationChart
  } = (0, _population_chart.newJobPopulationChartProvider)(client);
  return {
    newJobLineChart,
    newJobPopulationChart
  };
}