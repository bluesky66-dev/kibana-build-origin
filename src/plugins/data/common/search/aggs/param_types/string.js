"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringParamType = void 0;

var _base = require("./base");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class StringParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);

    if (!config.write) {
      this.write = (aggConfig, output) => {
        if (aggConfig.params[this.name] && aggConfig.params[this.name].length) {
          output.params[this.name] = aggConfig.params[this.name];
        }
      };
    }
  }

}

exports.StringParamType = StringParamType;