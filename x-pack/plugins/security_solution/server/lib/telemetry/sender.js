"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyAllowlistedFields = copyAllowlistedFields;
exports.getV3UrlFromV2 = getV3UrlFromV2;
exports.TelemetryEventsSender = void 0;

var _lodash = require("lodash");

var _axios = _interopRequireDefault(require("axios"));

var _url = require("url");

var _create_stream_from_ndjson = require("../../utils/read_stream/create_stream_from_ndjson");

var _task = require("./task");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

class TelemetryEventsSender {
  // Assume true until the first check
  constructor(logger) {
    _defineProperty(this, "initialCheckDelayMs", 10 * 1000);

    _defineProperty(this, "checkIntervalMs", 60 * 1000);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "core", void 0);

    _defineProperty(this, "maxQueueSize", 100);

    _defineProperty(this, "telemetryStart", void 0);

    _defineProperty(this, "telemetrySetup", void 0);

    _defineProperty(this, "intervalId", void 0);

    _defineProperty(this, "isSending", false);

    _defineProperty(this, "queue", []);

    _defineProperty(this, "isOptedIn", true);

    _defineProperty(this, "diagTask", void 0);

    this.logger = logger.get('telemetry_events');
  }

  setup(telemetrySetup, taskManager) {
    this.telemetrySetup = telemetrySetup;

    if (taskManager) {
      this.diagTask = new _task.TelemetryDiagTask(this.logger, taskManager, this);
    }
  }

  start(core, telemetryStart, taskManager) {
    this.telemetryStart = telemetryStart;
    this.core = core;

    if (taskManager && this.diagTask) {
      this.logger.debug(`Starting diag task`);
      this.diagTask.start(taskManager);
    }

    this.logger.debug(`Starting local task`);
    setTimeout(() => {
      this.sendIfDue();
      this.intervalId = setInterval(() => this.sendIfDue(), this.checkIntervalMs);
    }, this.initialCheckDelayMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async fetchDiagnosticAlerts(executeFrom, executeTo) {
    const query = {
      expand_wildcards: 'open,hidden',
      index: '.logs-endpoint.diagnostic.collection-*',
      ignore_unavailable: true,
      size: this.maxQueueSize,
      body: {
        query: {
          range: {
            'event.ingested': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        sort: [{
          'event.ingested': {
            order: 'desc'
          }
        }]
      }
    };

    if (!this.core) {
      throw Error('could not fetch diagnostic alerts. core is not available');
    }

    const callCluster = this.core.elasticsearch.legacy.client.callAsInternalUser;
    return callCluster('search', query);
  }

  queueTelemetryEvents(events) {
    const qlength = this.queue.length;

    if (events.length === 0) {
      return;
    }

    this.logger.debug(`Queue events`);

    if (qlength >= this.maxQueueSize) {
      // we're full already
      return;
    }

    if (events.length > this.maxQueueSize - qlength) {
      this.queue.push(...this.processEvents(events.slice(0, this.maxQueueSize - qlength)));
    } else {
      this.queue.push(...this.processEvents(events));
    }
  }

  processEvents(events) {
    return events.map(function (obj) {
      return copyAllowlistedFields(allowlistEventFields, obj);
    });
  }

  async isTelemetryOptedIn() {
    var _this$telemetryStart;

    this.isOptedIn = await ((_this$telemetryStart = this.telemetryStart) === null || _this$telemetryStart === void 0 ? void 0 : _this$telemetryStart.getIsOptedIn());
    return this.isOptedIn === true;
  }

  async sendIfDue() {
    if (this.isSending) {
      return;
    }

    if (this.queue.length === 0) {
      return;
    }

    try {
      var _clusterInfo$version;

      this.isSending = true;
      this.isOptedIn = await this.isTelemetryOptedIn();

      if (!this.isOptedIn) {
        this.logger.debug(`Telemetry is not opted-in.`);
        this.queue = [];
        this.isSending = false;
        return;
      }

      const [telemetryUrl, clusterInfo, licenseInfo] = await Promise.all([this.fetchTelemetryUrl(), this.fetchClusterInfo(), this.fetchLicenseInfo()]);
      this.logger.debug(`Telemetry URL: ${telemetryUrl}`);
      this.logger.debug(`cluster_uuid: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid} cluster_name: ${clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name}`);
      const toSend = (0, _lodash.cloneDeep)(this.queue).map(event => ({ ...event,
        ...(licenseInfo ? {
          license: this.copyLicenseFields(licenseInfo)
        } : {}),
        cluster_uuid: clusterInfo.cluster_uuid,
        cluster_name: clusterInfo.cluster_name
      }));
      this.queue = [];
      await this.sendEvents(toSend, telemetryUrl, clusterInfo.cluster_uuid, (_clusterInfo$version = clusterInfo.version) === null || _clusterInfo$version === void 0 ? void 0 : _clusterInfo$version.number, licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid);
    } catch (err) {
      this.logger.warn(`Error sending telemetry events data: ${err}`);
      this.queue = [];
    }

    this.isSending = false;
  }

  async fetchClusterInfo() {
    if (!this.core) {
      throw Error("Couldn't fetch cluster info because core is not available");
    }

    const callCluster = this.core.elasticsearch.legacy.client.callAsInternalUser;
    return getClusterInfo(callCluster);
  }

  async fetchTelemetryUrl() {
    var _this$telemetrySetup;

    const telemetryUrl = await ((_this$telemetrySetup = this.telemetrySetup) === null || _this$telemetrySetup === void 0 ? void 0 : _this$telemetrySetup.getTelemetryUrl());

    if (!telemetryUrl) {
      throw Error("Couldn't get telemetry URL");
    }

    return getV3UrlFromV2(telemetryUrl.toString(), 'alerts-endpoint');
  }

  async fetchLicenseInfo() {
    if (!this.core) {
      return undefined;
    }

    try {
      const callCluster = this.core.elasticsearch.legacy.client.callAsInternalUser;
      const ret = await getLicense(callCluster, true);
      return ret.license;
    } catch (err) {
      this.logger.warn(`Error retrieving license: ${err}`);
      return undefined;
    }
  }

  copyLicenseFields(lic) {
    return {
      uid: lic.uid,
      status: lic.status,
      type: lic.type,
      ...(lic.issued_to ? {
        issued_to: lic.issued_to
      } : {}),
      ...(lic.issuer ? {
        issuer: lic.issuer
      } : {})
    };
  }

  async sendEvents(events, telemetryUrl, clusterUuid, clusterVersionNumber, licenseId) {
    // this.logger.debug(`Sending events: ${JSON.stringify(events, null, 2)}`);
    const ndjson = (0, _create_stream_from_ndjson.transformDataToNdjson)(events); // this.logger.debug(`NDJSON: ${ndjson}`);

    try {
      const resp = await _axios.default.post(telemetryUrl, ndjson, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'X-Elastic-Cluster-ID': clusterUuid,
          'X-Elastic-Stack-Version': clusterVersionNumber ? clusterVersionNumber : '7.10.0',
          ...(licenseId ? {
            'X-Elastic-License-ID': licenseId
          } : {})
        }
      });
      this.logger.debug(`Events sent!. Response: ${resp.status} ${JSON.stringify(resp.data)}`);
    } catch (err) {
      this.logger.warn(`Error sending events: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    }
  }

} // For the Allowlist definition.


exports.TelemetryEventsSender = TelemetryEventsSender; // Allow list process fields within events.  This includes "process" and "Target.process".'

/* eslint-disable @typescript-eslint/naming-convention */

const allowlistProcessFields = {
  name: true,
  executable: true,
  command_line: true,
  hash: true,
  pid: true,
  uptime: true,
  Ext: {
    architecture: true,
    code_signature: true,
    dll: true,
    token: {
      integrity_level_name: true
    }
  },
  parent: {
    name: true,
    executable: true,
    command_line: true,
    hash: true,
    Ext: {
      architecture: true,
      code_signature: true,
      dll: true,
      token: {
        integrity_level_name: true
      }
    },
    uptime: true,
    pid: true,
    ppid: true
  },
  thread: true
}; // Allow list for the data we include in the events. True means that it is deep-cloned
// blindly. Object contents means that we only copy the fields that appear explicitly in
// the sub-object.

const allowlistEventFields = {
  '@timestamp': true,
  agent: true,
  Endpoint: true,
  Memory_protection: true,
  Ransomware: true,
  data_stream: true,
  ecs: true,
  elastic: true,
  event: true,
  rule: {
    id: true,
    name: true,
    ruleset: true
  },
  file: {
    name: true,
    path: true,
    size: true,
    created: true,
    accessed: true,
    mtime: true,
    directory: true,
    hash: true,
    Ext: {
      code_signature: true,
      malware_classification: true,
      malware_signature: true,
      quarantine_result: true,
      quarantine_message: true
    }
  },
  host: {
    os: true
  },
  process: allowlistProcessFields,
  Target: {
    process: allowlistProcessFields
  }
};

function copyAllowlistedFields(allowlist, event) {
  return Object.entries(allowlist).reduce((newEvent, [allowKey, allowValue]) => {
    const eventValue = event[allowKey];

    if (eventValue !== null && eventValue !== undefined) {
      if (allowValue === true) {
        return { ...newEvent,
          [allowKey]: eventValue
        };
      } else if (typeof allowValue === 'object' && typeof eventValue === 'object') {
        const values = copyAllowlistedFields(allowValue, eventValue);
        return { ...newEvent,
          ...(Object.keys(values).length > 0 ? {
            [allowKey]: values
          } : {})
        };
      }
    }

    return newEvent;
  }, {});
} // Forms URLs like:
// https://telemetry.elastic.co/v3/send/my-channel-name or
// https://telemetry-staging.elastic.co/v3-dev/send/my-channel-name


function getV3UrlFromV2(v2url, channel) {
  const url = new _url.URL(v2url);

  if (!url.hostname.includes('staging')) {
    url.pathname = `/v3/send/${channel}`;
  } else {
    url.pathname = `/v3-dev/send/${channel}`;
  }

  return url.toString();
} // For getting cluster info. Copied from telemetry_collection/get_cluster_info.ts

/**
 * Get the cluster info from the connected cluster.
 *
 * This is the equivalent to GET /
 *
 * @param {function} callCluster The callWithInternalUser handler (exposed for testing)
 */


function getClusterInfo(callCluster) {
  return callCluster('info');
} // From https://www.elastic.co/guide/en/elasticsearch/reference/current/get-license.html


function getLicense(callCluster, local) {
  return callCluster('transport.request', {
    method: 'GET',
    path: '/_license',
    query: {
      local,
      // For versions >= 7.6 and < 8.0, this flag is needed otherwise 'platinum' is returned for 'enterprise' license.
      accept_enterprise: 'true'
    }
  });
}