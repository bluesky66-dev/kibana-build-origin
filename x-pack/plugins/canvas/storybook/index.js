"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getAddonPanelParameters: true,
  ACTIONS_PANEL_ID: true
};
Object.defineProperty(exports, "ACTIONS_PANEL_ID", {
  enumerable: true,
  get: function () {
    return _constants.ACTIONS_PANEL_ID;
  }
});
exports.getAddonPanelParameters = void 0;

var _constants = require("./addon/src/constants");

var _decorators = require("./decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAddonPanelParameters = () => ({
  options: {
    selectedPanel: _constants.ACTIONS_PANEL_ID
  }
});

exports.getAddonPanelParameters = getAddonPanelParameters;