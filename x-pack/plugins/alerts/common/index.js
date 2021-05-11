"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BASE_ALERT_API_PATH: true,
  ALERTS_FEATURE_ID: true
};
exports.ALERTS_FEATURE_ID = exports.BASE_ALERT_API_PATH = void 0;

var _alert = require("./alert");

Object.keys(_alert).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert[key];
    }
  });
});

var _alert_type = require("./alert_type");

Object.keys(_alert_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_type[key];
    }
  });
});

var _alert_instance = require("./alert_instance");

Object.keys(_alert_instance).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_instance[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_instance[key];
    }
  });
});

var _alert_task_instance = require("./alert_task_instance");

Object.keys(_alert_task_instance).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_task_instance[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_task_instance[key];
    }
  });
});

var _alert_navigation = require("./alert_navigation");

Object.keys(_alert_navigation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_navigation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_navigation[key];
    }
  });
});

var _alert_instance_summary = require("./alert_instance_summary");

Object.keys(_alert_instance_summary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_instance_summary[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_instance_summary[key];
    }
  });
});

var _builtin_action_groups = require("./builtin_action_groups");

Object.keys(_builtin_action_groups).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _builtin_action_groups[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _builtin_action_groups[key];
    }
  });
});

var _disabled_action_groups = require("./disabled_action_groups");

Object.keys(_disabled_action_groups).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _disabled_action_groups[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _disabled_action_groups[key];
    }
  });
});

var _alert_notify_when_type = require("./alert_notify_when_type");

Object.keys(_alert_notify_when_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_notify_when_type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_notify_when_type[key];
    }
  });
});

var _parse_duration = require("./parse_duration");

Object.keys(_parse_duration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _parse_duration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _parse_duration[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BASE_ALERT_API_PATH = '/api/alerts';
exports.BASE_ALERT_API_PATH = BASE_ALERT_API_PATH;
const ALERTS_FEATURE_ID = 'alerts';
exports.ALERTS_FEATURE_ID = ALERTS_FEATURE_ID;