"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SO_SEARCH_LIMIT: true,
  FLEET_SERVER_INDICES_VERSION: true,
  FLEET_SERVER_INDICES: true
};
exports.FLEET_SERVER_INDICES = exports.FLEET_SERVER_INDICES_VERSION = exports.SO_SEARCH_LIMIT = void 0;

var _plugin = require("./plugin");

Object.keys(_plugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _plugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _plugin[key];
    }
  });
});

var _routes = require("./routes");

Object.keys(_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routes[key];
    }
  });
});

var _agent = require("./agent");

Object.keys(_agent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _agent[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _agent[key];
    }
  });
});

var _agent_policy = require("./agent_policy");

Object.keys(_agent_policy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _agent_policy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _agent_policy[key];
    }
  });
});

var _package_policy = require("./package_policy");

Object.keys(_package_policy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _package_policy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _package_policy[key];
    }
  });
});

var _epm = require("./epm");

Object.keys(_epm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _epm[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _epm[key];
    }
  });
});

var _output = require("./output");

Object.keys(_output).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _output[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _output[key];
    }
  });
});

var _enrollment_api_key = require("./enrollment_api_key");

Object.keys(_enrollment_api_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _enrollment_api_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _enrollment_api_key[key];
    }
  });
});

var _settings = require("./settings");

Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: This is the default `index.max_result_window` ES setting, which dictates
// the maximum amount of results allowed to be returned from a search. It's possible
// for the actual setting to differ from the default. Can we retrieve the real
// setting in the future?

const SO_SEARCH_LIMIT = 10000;
exports.SO_SEARCH_LIMIT = SO_SEARCH_LIMIT;
const FLEET_SERVER_INDICES_VERSION = 1;
exports.FLEET_SERVER_INDICES_VERSION = FLEET_SERVER_INDICES_VERSION;
const FLEET_SERVER_INDICES = ['.fleet-actions', '.fleet-agents', '.fleet-enrollment-api-keys', '.fleet-policies', '.fleet-policies-leader', '.fleet-servers'];
exports.FLEET_SERVER_INDICES = FLEET_SERVER_INDICES;