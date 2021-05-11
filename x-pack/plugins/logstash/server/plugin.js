"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogstashPlugin = void 0;

var _routes = require("./routes");

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

class LogstashPlugin {
  constructor(context) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "esClient", void 0);

    _defineProperty(this, "coreSetup", void 0);

    this.logger = context.logger.get();
  }

  setup(core, deps) {
    this.logger.debug('Setting up Logstash plugin');
    this.coreSetup = core;
    (0, _routes.registerRoutes)(core.http.createRouter(), deps.security);
    deps.features.registerElasticsearchFeature({
      id: 'pipelines',
      management: {
        ingest: ['pipelines']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage_logstash_pipelines'],
        requiredIndexPrivileges: {},
        ui: []
      }]
    });
  }

  start(core) {
    const esClient = core.elasticsearch.legacy.createClient('logstash');
    this.coreSetup.http.registerRouteHandlerContext('logstash', async (context, request) => {
      return {
        esClient: esClient.asScoped(request)
      };
    });
  }

  stop() {
    if (this.esClient) {
      this.esClient.close();
    }
  }

}

exports.LogstashPlugin = LogstashPlugin;