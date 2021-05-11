"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = createConfig;
exports.MonitoringElasticsearchConfig = exports.configSchema = exports.monitoringElasticsearchConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../src/core/server/");

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

const hostURISchema = _configSchema.schema.uri({
  scheme: ['http', 'https']
});

const elasticsearchConfigSchema = _server.config.elasticsearch.schema;
const monitoringElasticsearchConfigSchema = elasticsearchConfigSchema.extends({
  logFetchCount: _configSchema.schema.number({
    defaultValue: 10
  }),
  hosts: _configSchema.schema.maybe(_configSchema.schema.oneOf([hostURISchema, _configSchema.schema.arrayOf(hostURISchema, {
    minSize: 1
  })]))
});
exports.monitoringElasticsearchConfigSchema = monitoringElasticsearchConfigSchema;

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    ccs: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }),
    logs: _configSchema.schema.object({
      index: _configSchema.schema.string({
        defaultValue: 'filebeat-*'
      })
    }),
    metricbeat: _configSchema.schema.object({
      index: _configSchema.schema.string({
        defaultValue: 'metricbeat-*'
      })
    }),
    max_bucket_size: _configSchema.schema.number({
      defaultValue: 10000
    }),
    elasticsearch: monitoringElasticsearchConfigSchema,
    container: _configSchema.schema.object({
      elasticsearch: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      logstash: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }),
    min_interval_seconds: _configSchema.schema.number({
      defaultValue: 10
    }),
    show_license_expiration: _configSchema.schema.boolean({
      defaultValue: true
    })
  }),
  kibana: _configSchema.schema.object({
    collection: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      interval: _configSchema.schema.number({
        defaultValue: 10000
      }) // op status metrics get buffered at `ops.interval` and flushed to the bulk endpoint at this interval

    })
  }),
  cluster_alerts: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    email_notifications: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      email_address: _configSchema.schema.string({
        defaultValue: ''
      })
    })
  }),
  licensing: _configSchema.schema.object({
    api_polling_frequency: _configSchema.schema.duration({
      defaultValue: '30s'
    })
  }),
  agent: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      defaultValue: '10s'
    }) // TOOD: NP
    // .regex(/[\d\.]+[yMwdhms]/)

  }),
  tests: _configSchema.schema.object({
    cloud_detector: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })
  })
});

exports.configSchema = configSchema;

class MonitoringElasticsearchConfig extends _server.ElasticsearchConfig {
  constructor(rawConfig) {
    super(rawConfig);

    _defineProperty(this, "logFetchCount", void 0);

    this.logFetchCount = rawConfig.logFetchCount;
  }

}

exports.MonitoringElasticsearchConfig = MonitoringElasticsearchConfig;

function createConfig(config) {
  return { ...config,
    ui: { ...config.ui,
      elasticsearch: new MonitoringElasticsearchConfig(config.ui.elasticsearch)
    }
  };
}