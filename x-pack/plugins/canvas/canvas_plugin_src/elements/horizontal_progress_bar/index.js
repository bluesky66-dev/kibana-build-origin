"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.horizontalProgressBar = void 0;

var _fonts = require("../../../common/lib/fonts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const horizontalProgressBar = () => ({
  name: 'horizontalProgressBar',
  displayName: 'Horizontal bar',
  type: 'progress',
  help: 'Displays progress as a portion of a horizontal bar',
  width: 400,
  height: 30,
  expression: `filters
| demodata
| math "mean(percent_uptime)"
| progress shape="horizontalBar" label={formatnumber 0%} font={font size=24 family="${_fonts.openSans.value}" color="#000000" align=center}
| render`
});

exports.horizontalProgressBar = horizontalProgressBar;