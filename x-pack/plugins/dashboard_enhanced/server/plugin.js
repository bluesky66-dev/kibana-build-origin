"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardEnhancedPlugin = void 0;

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DashboardEnhancedPlugin {
  constructor(context) {
    this.context = context;
  }

  setup(core, plugins) {
    plugins.uiActionsEnhanced.registerActionFactory({
      id: _common.EMBEDDABLE_TO_DASHBOARD_DRILLDOWN,
      inject: (0, _common.createInject)({
        drilldownId: _common.EMBEDDABLE_TO_DASHBOARD_DRILLDOWN
      }),
      extract: (0, _common.createExtract)({
        drilldownId: _common.EMBEDDABLE_TO_DASHBOARD_DRILLDOWN
      })
    });
    return {};
  }

  start(core, plugins) {
    return {};
  }

  stop() {}

}

exports.DashboardEnhancedPlugin = DashboardEnhancedPlugin;