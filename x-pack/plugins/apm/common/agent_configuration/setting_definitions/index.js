"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterByAgent = filterByAgent;
exports.validateSetting = validateSetting;
exports.settingDefinitions = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _Either = require("fp-ts/lib/Either");

var _PathReporter = require("io-ts/lib/PathReporter");

var _boolean_rt = require("../runtime_types/boolean_rt");

var _integer_rt = require("../runtime_types/integer_rt");

var _agent_name = require("../../agent_name");

var _float_rt = require("../runtime_types/float_rt");

var _general_settings = require("./general_settings");

var _java_settings = require("./java_settings");

var _duration_rt = require("../runtime_types/duration_rt");

var _bytes_rt = require("../runtime_types/bytes_rt");

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


function getSettingDefaults(setting) {
  switch (setting.type) {
    case 'select':
      return {
        validation: t.string,
        ...setting
      };

    case 'boolean':
      return {
        validation: _boolean_rt.booleanRt,
        ...setting
      };

    case 'text':
      return {
        validation: t.string,
        ...setting
      };

    case 'integer':
      {
        const {
          min,
          max
        } = setting;
        return {
          validation: (0, _integer_rt.getIntegerRt)({
            min,
            max
          }),
          min,
          max,
          ...setting
        };
      }

    case 'float':
      {
        return {
          validation: _float_rt.floatRt,
          ...setting
        };
      }

    case 'bytes':
      {
        var _setting$units, _setting$min;

        const units = (_setting$units = setting.units) !== null && _setting$units !== void 0 ? _setting$units : ['b', 'kb', 'mb'];
        const min = (_setting$min = setting.min) !== null && _setting$min !== void 0 ? _setting$min : '0b';
        const max = setting.max;
        return {
          validation: (0, _bytes_rt.getBytesRt)({
            min,
            max
          }),
          units,
          min,
          ...setting
        };
      }

    case 'duration':
      {
        var _setting$units2, _setting$min2;

        const units = (_setting$units2 = setting.units) !== null && _setting$units2 !== void 0 ? _setting$units2 : ['ms', 's', 'm'];
        const min = (_setting$min2 = setting.min) !== null && _setting$min2 !== void 0 ? _setting$min2 : '1ms';
        const max = setting.max;
        return {
          validation: (0, _duration_rt.getDurationRt)({
            min,
            max
          }),
          units,
          min,
          ...setting
        };
      }

    default:
      return setting;
  }
}

function filterByAgent(agentName) {
  return setting => {
    // agentName is missing if "All" was selected
    if (!agentName) {
      // options that only apply to certain agents will be filtered out
      if (setting.includeAgents) {
        return false;
      } // only options that apply to every agent (ignoring RUM) should be returned


      if (setting.excludeAgents) {
        return setting.excludeAgents.every(_agent_name.isRumAgentName);
      }

      return true;
    }

    if (setting.includeAgents) {
      return setting.includeAgents.includes(agentName);
    }

    if (setting.excludeAgents) {
      return !setting.excludeAgents.includes(agentName);
    }

    return true;
  };
}

function validateSetting(setting, value) {
  const result = setting.validation.decode(value);

  const message = _PathReporter.PathReporter.report(result)[0];

  const isValid = (0, _Either.isRight)(result);
  return {
    isValid,
    message
  };
}

const settingDefinitions = (0, _lodash.sortBy)([..._general_settings.generalSettings, ..._java_settings.javaSettings].map(getSettingDefaults), 'key');
exports.settingDefinitions = settingDefinitions;