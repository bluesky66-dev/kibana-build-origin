"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveSeries = void 0;

var _panel_types = require("../../../../common/panel_types");

var _ui_restrictions = require("../../../../common/ui_restrictions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getActiveSeries = panel => {
  let visibleSeries = panel.series || [];

  if (panel.type in _ui_restrictions.limitOfSeries) {
    visibleSeries = visibleSeries.slice(0, _ui_restrictions.limitOfSeries[panel.type]);
  } // Toogle visibility functionality for 'gauge', 'markdown' is not accessible


  const shouldNotApplyFilter = _panel_types.PANEL_TYPES.GAUGE === panel.type || _panel_types.PANEL_TYPES.MARKDOWN === panel.type;
  return visibleSeries.filter(series => !series.hidden || shouldNotApplyFilter);
};

exports.getActiveSeries = getActiveSeries;