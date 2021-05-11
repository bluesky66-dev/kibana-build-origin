"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Plugin = void 0;

var _lodash = require("lodash");

var _elasticsearch_plugin = _interopRequireDefault(require("./elasticsearch_plugin"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  canvas: {
    enabled: true,
    indexPrefix: '.canvas'
  }
};

class Plugin {
  constructor(props) {
    this.props = props;
    this.routes = [];
    this.server = {
      plugins: {
        [this.props.name]: {},
        elasticsearch: _elasticsearch_plugin.default
      },
      config: () => ({
        get: key => (0, _lodash.get)(config, key),
        has: key => (0, _lodash.has)(config, key)
      }),
      route: def => this.routes.push(def)
    };
    const {
      init
    } = this.props;

    this.init = () => init(this.server);
  }

}

exports.Plugin = Plugin;
var _default = {
  Plugin
};
exports.default = _default;