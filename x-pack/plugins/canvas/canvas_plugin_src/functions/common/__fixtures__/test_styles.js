"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideAxis = exports.yAxisConfig = exports.xAxisConfig = exports.gradientPalette = exports.grayscalePalette = exports.seriesStyle = exports.defaultStyle = exports.containerStyle = exports.fontStyle = void 0;

var _elastic_logo = require("../../../lib/elastic_logo");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fontStyle = {
  type: 'style',
  spec: {
    fontFamily: 'Chalkboard, serif',
    fontWeight: 'bolder',
    fontStyle: 'normal',
    textDecoration: 'underline',
    color: 'pink',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '21px'
  },
  css: 'font-family:Chalkboard, serif;font-weight:bolder;font-style:normal;text-decoration:underline;color:pink;text-align:center;font-size:14px;line-height:21px'
};
exports.fontStyle = fontStyle;
const containerStyle = {
  type: 'containerStyle',
  border: '3px dotted blue',
  borderRadius: '5px',
  padding: '10px',
  backgroundColor: 'red',
  backgroundImage: `url(${_elastic_logo.elasticLogo})`,
  opacity: 0.5,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat'
};
exports.containerStyle = containerStyle;
const defaultStyle = {
  type: 'seriesStyle',
  label: null,
  color: null,
  lines: 0,
  bars: 0,
  points: 3,
  fill: false,
  stack: undefined,
  horizontalBars: true
};
exports.defaultStyle = defaultStyle;
const seriesStyle = {
  type: 'seriesStyle',
  label: 'product1',
  color: 'blue',
  lines: 0,
  bars: 0,
  points: 5,
  fill: true,
  stack: 1,
  horizontalBars: true
};
exports.seriesStyle = seriesStyle;
const grayscalePalette = {
  type: 'palette',
  name: 'custom',
  params: {
    colors: ['#FFFFFF', '#888888', '#000000'],
    gradient: false
  }
};
exports.grayscalePalette = grayscalePalette;
const gradientPalette = {
  type: 'palette',
  name: 'custom',
  params: {
    colors: ['#FFFFFF', '#000000'],
    gradient: true
  }
};
exports.gradientPalette = gradientPalette;
const xAxisConfig = {
  type: 'axisConfig',
  show: true,
  position: 'top'
};
exports.xAxisConfig = xAxisConfig;
const yAxisConfig = {
  type: 'axisConfig',
  show: true,
  position: 'right'
};
exports.yAxisConfig = yAxisConfig;
const hideAxis = {
  type: 'axisConfig',
  show: false,
  position: 'right'
};
exports.hideAxis = hideAxis;