"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureUsageService = void 0;

var _lodash = require("lodash");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class FeatureUsageService {
  constructor() {
    _defineProperty(this, "lastUsages", new Map());
  }

  setup() {
    return {
      register: (featureName, licenseType) => {
        const registered = this.lastUsages.get(featureName);

        if (registered) {
          if (registered.licenseType !== licenseType) {
            throw new Error(`Feature '${featureName}' has already been registered with another license type. (current: ${registered.licenseType}, new: ${licenseType})`);
          }
        } else {
          this.lastUsages.set(featureName, {
            name: featureName,
            lastUsed: null,
            licenseType
          });
        }
      }
    };
  }

  start() {
    return {
      notifyUsage: (featureName, usedAt = Date.now()) => {
        const usage = this.lastUsages.get(featureName);

        if (!usage) {
          throw new Error(`Feature '${featureName}' is not registered.`);
        }

        const lastUsed = (0, _lodash.isDate)(usedAt) ? usedAt : new Date(usedAt);

        if (usage.lastUsed == null || lastUsed > usage.lastUsed) {
          usage.lastUsed = lastUsed;
        }
      },
      getLastUsages: () => Array.from(this.lastUsages.values())
    };
  }

}

exports.FeatureUsageService = FeatureUsageService;