"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionRenderer = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionRenderer {
  constructor(config) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "displayName", void 0);

    _defineProperty(this, "help", void 0);

    _defineProperty(this, "validate", void 0);

    _defineProperty(this, "reuseDomNode", void 0);

    _defineProperty(this, "render", void 0);

    const {
      name,
      displayName,
      help,
      validate,
      reuseDomNode,
      render
    } = config;
    this.name = name;
    this.displayName = displayName || name;
    this.help = help || '';

    this.validate = validate || (() => {});

    this.reuseDomNode = Boolean(reuseDomNode);
    this.render = render;
  }

}

exports.ExpressionRenderer = ExpressionRenderer;