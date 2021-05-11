"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  checkAccessRoute: true,
  beatsDetailRoute: true,
  beatsListingRoute: true,
  beatsOverviewRoute: true,
  clusterRoute: true,
  clustersRoute: true,
  esIndexRoute: true,
  esIndicesRoute: true,
  esNodeRoute: true,
  esNodesRoute: true,
  esOverviewRoute: true,
  mlJobRoute: true,
  ccrRoute: true,
  ccrShardRoute: true,
  internalMonitoringCheckRoute: true,
  clusterSettingsCheckRoute: true,
  nodesSettingsCheckRoute: true,
  setCollectionEnabledRoute: true,
  setCollectionIntervalRoute: true,
  kibanaInstanceRoute: true,
  kibanaInstancesRoute: true,
  kibanaOverviewRoute: true,
  apmInstanceRoute: true,
  apmInstancesRoute: true,
  apmOverviewRoute: true,
  logstashClusterPipelinesRoute: true,
  logstashNodePipelinesRoute: true,
  logstashNodeRoute: true,
  logstashNodesRoute: true,
  logstashOverviewRoute: true,
  logstashPipelineRoute: true,
  logstashClusterPipelineIdsRoute: true
};
Object.defineProperty(exports, "checkAccessRoute", {
  enumerable: true,
  get: function () {
    return _check_access.checkAccessRoute;
  }
});
Object.defineProperty(exports, "beatsDetailRoute", {
  enumerable: true,
  get: function () {
    return _beats.beatsDetailRoute;
  }
});
Object.defineProperty(exports, "beatsListingRoute", {
  enumerable: true,
  get: function () {
    return _beats.beatsListingRoute;
  }
});
Object.defineProperty(exports, "beatsOverviewRoute", {
  enumerable: true,
  get: function () {
    return _beats.beatsOverviewRoute;
  }
});
Object.defineProperty(exports, "clusterRoute", {
  enumerable: true,
  get: function () {
    return _cluster.clusterRoute;
  }
});
Object.defineProperty(exports, "clustersRoute", {
  enumerable: true,
  get: function () {
    return _cluster.clustersRoute;
  }
});
Object.defineProperty(exports, "esIndexRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.esIndexRoute;
  }
});
Object.defineProperty(exports, "esIndicesRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.esIndicesRoute;
  }
});
Object.defineProperty(exports, "esNodeRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.esNodeRoute;
  }
});
Object.defineProperty(exports, "esNodesRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.esNodesRoute;
  }
});
Object.defineProperty(exports, "esOverviewRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.esOverviewRoute;
  }
});
Object.defineProperty(exports, "mlJobRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.mlJobRoute;
  }
});
Object.defineProperty(exports, "ccrRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ccrRoute;
  }
});
Object.defineProperty(exports, "ccrShardRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ccrShardRoute;
  }
});
Object.defineProperty(exports, "internalMonitoringCheckRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch_settings.internalMonitoringCheckRoute;
  }
});
Object.defineProperty(exports, "clusterSettingsCheckRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch_settings.clusterSettingsCheckRoute;
  }
});
Object.defineProperty(exports, "nodesSettingsCheckRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch_settings.nodesSettingsCheckRoute;
  }
});
Object.defineProperty(exports, "setCollectionEnabledRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch_settings.setCollectionEnabledRoute;
  }
});
Object.defineProperty(exports, "setCollectionIntervalRoute", {
  enumerable: true,
  get: function () {
    return _elasticsearch_settings.setCollectionIntervalRoute;
  }
});
Object.defineProperty(exports, "kibanaInstanceRoute", {
  enumerable: true,
  get: function () {
    return _kibana.kibanaInstanceRoute;
  }
});
Object.defineProperty(exports, "kibanaInstancesRoute", {
  enumerable: true,
  get: function () {
    return _kibana.kibanaInstancesRoute;
  }
});
Object.defineProperty(exports, "kibanaOverviewRoute", {
  enumerable: true,
  get: function () {
    return _kibana.kibanaOverviewRoute;
  }
});
Object.defineProperty(exports, "apmInstanceRoute", {
  enumerable: true,
  get: function () {
    return _apm.apmInstanceRoute;
  }
});
Object.defineProperty(exports, "apmInstancesRoute", {
  enumerable: true,
  get: function () {
    return _apm.apmInstancesRoute;
  }
});
Object.defineProperty(exports, "apmOverviewRoute", {
  enumerable: true,
  get: function () {
    return _apm.apmOverviewRoute;
  }
});
Object.defineProperty(exports, "logstashClusterPipelinesRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashClusterPipelinesRoute;
  }
});
Object.defineProperty(exports, "logstashNodePipelinesRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashNodePipelinesRoute;
  }
});
Object.defineProperty(exports, "logstashNodeRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashNodeRoute;
  }
});
Object.defineProperty(exports, "logstashNodesRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashNodesRoute;
  }
});
Object.defineProperty(exports, "logstashOverviewRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashOverviewRoute;
  }
});
Object.defineProperty(exports, "logstashPipelineRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashPipelineRoute;
  }
});
Object.defineProperty(exports, "logstashClusterPipelineIdsRoute", {
  enumerable: true,
  get: function () {
    return _logstash.logstashClusterPipelineIdsRoute;
  }
});

var _check_access = require("./check_access");

var _alerts = require("./alerts/");

Object.keys(_alerts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alerts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts[key];
    }
  });
});

var _beats = require("./beats");

var _cluster = require("./cluster");

var _elasticsearch = require("./elasticsearch");

var _elasticsearch_settings = require("./elasticsearch_settings");

var _kibana = require("./kibana");

var _apm = require("./apm");

var _logstash = require("./logstash");

var _setup = require("./setup");

Object.keys(_setup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _setup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _setup[key];
    }
  });
});