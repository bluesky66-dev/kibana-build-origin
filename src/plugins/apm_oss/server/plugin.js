"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APMOSSPlugin = void 0;

var _tutorial = require("./tutorial");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class APMOSSPlugin {
  constructor(initContext) {
    this.initContext = initContext;
    this.initContext = initContext;
  }

  setup(core, plugins) {
    const config$ = this.initContext.config.create();
    const config = this.initContext.config.get();
    const apmTutorialProvider = (0, _tutorial.tutorialProvider)({
      indexPatternTitle: config.indexPattern,
      indices: {
        errorIndices: config.errorIndices,
        metricsIndices: config.metricsIndices,
        onboardingIndices: config.onboardingIndices,
        sourcemapIndices: config.sourcemapIndices,
        transactionIndices: config.transactionIndices
      }
    });
    plugins.home.tutorials.registerTutorial(apmTutorialProvider);
    return {
      config,
      config$,
      getRegisteredTutorialProvider: () => apmTutorialProvider
    };
  }

  start() {}

  stop() {}

}

exports.APMOSSPlugin = APMOSSPlugin;