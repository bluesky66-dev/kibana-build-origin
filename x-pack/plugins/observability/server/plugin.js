"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservabilityPlugin = void 0;

var _bootstrap_annotations = require("./lib/annotations/bootstrap_annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ObservabilityPlugin {
  constructor(initContext) {
    this.initContext = initContext;
    this.initContext = initContext;
  }

  setup(core, plugins) {
    const config = this.initContext.config.get();
    let annotationsApiPromise;

    if (config.annotations.enabled) {
      annotationsApiPromise = (0, _bootstrap_annotations.bootstrapAnnotations)({
        core,
        index: config.annotations.index,
        context: this.initContext
      }).catch(err => {
        const logger = this.initContext.logger.get('annotations');
        logger.warn(err);
        throw err;
      });
    }

    return {
      getScopedAnnotationsClient: async (...args) => {
        const api = await annotationsApiPromise;
        return api === null || api === void 0 ? void 0 : api.getScopedAnnotationsClient(...args);
      }
    };
  }

  start() {}

  stop() {}

}

exports.ObservabilityPlugin = ObservabilityPlugin;