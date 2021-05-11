"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigurationSourcesAdapter = void 0;

var _inmemory_configuration_adapter = require("../configuration/inmemory_configuration_adapter");

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

class ConfigurationSourcesAdapter {
  constructor(configuration = new _inmemory_configuration_adapter.InmemoryConfigurationAdapter({
    sources: {}
  })) {
    _defineProperty(this, "configuration", void 0);

    this.configuration = configuration;
  }

  async getAll() {
    const sourceConfigurations = (await this.configuration.get()).sources || {
      default: DEFAULT_SOURCE
    };
    const sourceConfigurationsWithDefault = { ...sourceConfigurations,
      default: { ...DEFAULT_SOURCE,
        ...(sourceConfigurations.default || {})
      }
    };
    return Object.entries(sourceConfigurationsWithDefault).reduce((result, [sourceId, sourceConfiguration]) => ({ ...result,
      [sourceId]: { ...sourceConfiguration,
        fields: { ...DEFAULT_FIELDS,
          ...(sourceConfiguration.fields || {})
        }
      }
    }), {});
  }

}

exports.ConfigurationSourcesAdapter = ConfigurationSourcesAdapter;
const DEFAULT_FIELDS = {
  container: 'docker.container.name',
  host: 'beat.hostname',
  message: ['message', '@message'],
  pod: 'kubernetes.pod.name',
  tiebreaker: '_doc',
  timestamp: '@timestamp'
};
const DEFAULT_SOURCE = {
  fields: DEFAULT_FIELDS
};