"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verticalProgressBar = void 0;

var _fonts = require("../../../common/lib/fonts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const verticalProgressBar = () => ({
  name: 'verticalProgressBar',
  displayName: 'Vertical progress bar',
  type: 'progress',
  help: 'Displays progress as a portion of a vertical bar',
  width: 80,
  height: 400,
  expression: `filters
| demodata
| math "mean(percent_uptime)"
| progress shape="verticalBar" label={formatnumber 0%} font={font size=24 family="${_fonts.openSans.value}" color="#000000" align=center}
| render`
});

exports.verticalProgressBar = verticalProgressBar;