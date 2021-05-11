"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ESIndexPatternSavedObjectService", {
  enumerable: true,
  get: function () {
    return _es_index_pattern.ESIndexPatternSavedObjectService;
  }
});
Object.defineProperty(exports, "getRegistryUrl", {
  enumerable: true,
  get: function () {
    return _registry_url.getRegistryUrl;
  }
});
Object.defineProperty(exports, "agentPolicyService", {
  enumerable: true,
  get: function () {
    return _agent_policy.agentPolicyService;
  }
});
Object.defineProperty(exports, "packagePolicyService", {
  enumerable: true,
  get: function () {
    return _package_policy.packagePolicyService;
  }
});
Object.defineProperty(exports, "outputService", {
  enumerable: true,
  get: function () {
    return _output.outputService;
  }
});
Object.defineProperty(exports, "appContextService", {
  enumerable: true,
  get: function () {
    return _app_context.appContextService;
  }
});
Object.defineProperty(exports, "licenseService", {
  enumerable: true,
  get: function () {
    return _license.licenseService;
  }
});
exports.settingsService = void 0;

var settingsService = _interopRequireWildcard(require("./settings"));

exports.settingsService = settingsService;

var _es_index_pattern = require("./es_index_pattern");

var _registry_url = require("./epm/registry/registry_url");

var _agent_policy = require("./agent_policy");

var _package_policy = require("./package_policy");

var _output = require("./output");

var _app_context = require("./app_context");

var _license = require("./license");

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