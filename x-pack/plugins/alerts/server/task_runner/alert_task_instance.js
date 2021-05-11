"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskInstanceToAlertTaskInstance = taskInstanceToAlertTaskInstance;

var t = _interopRequireWildcard(require("io-ts"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _common = require("../../common");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const enumerateErrorFields = e => `${e.map(({
  context
}) => context.map(({
  key
}) => key).join('.'))}`;

function taskInstanceToAlertTaskInstance(taskInstance, alert) {
  return { ...taskInstance,
    params: (0, _pipeable.pipe)(_common.alertParamsSchema.decode(taskInstance.params), (0, _Either.fold)(e => {
      throw new Error(`Task "${taskInstance.id}" ${alert ? `(underlying Alert "${alert.id}") ` : ''}has an invalid param at ${enumerateErrorFields(e)}`);
    }, t.identity)),
    state: (0, _pipeable.pipe)(_common.alertStateSchema.decode(taskInstance.state), (0, _Either.fold)(e => {
      throw new Error(`Task "${taskInstance.id}" ${alert ? `(underlying Alert "${alert.id}") ` : ''}has invalid state at ${enumerateErrorFields(e)}`);
    }, t.identity))
  };
}