"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  typeFunctions: true
};
exports.typeFunctions = void 0;

var _embeddable = require("./embeddable");

Object.keys(_embeddable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _embeddable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _embeddable[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const typeFunctions = [_embeddable.embeddableType];
exports.typeFunctions = typeFunctions;