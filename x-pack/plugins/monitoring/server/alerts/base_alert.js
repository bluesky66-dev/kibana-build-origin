"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseAlert = void 0;

var _i18n = require("@kbn/i18n");

var _fetch_available_ccs = require("../lib/alerts/fetch_available_ccs");

var _fetch_clusters = require("../lib/alerts/fetch_clusters");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _constants = require("../../common/constants");

var _enums = require("../../common/enums");

var _mb_safe_query = require("../lib/mb_safe_query");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _parse_duration = require("../../../alerts/common/parse_duration");

var _static_globals = require("../static_globals");

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

const defaultAlertOptions = () => {
  return {
    id: '',
    name: '',
    throttle: '1d',
    interval: '1m',
    defaultParams: {
      threshold: 85,
      duration: '1h'
    },
    actionVariables: []
  };
};

class BaseAlert {
  constructor(rawAlert, alertOptions = defaultAlertOptions()) {
    this.rawAlert = rawAlert;
    this.alertOptions = alertOptions;

    _defineProperty(this, "scopedLogger", void 0);

    const defaultOptions = defaultAlertOptions();
    defaultOptions.defaultParams = { ...defaultOptions.defaultParams,
      ...this.alertOptions.defaultParams
    };
    this.alertOptions = { ...defaultOptions,
      ...this.alertOptions
    };
    this.scopedLogger = _static_globals.Globals.app.getLogger(alertOptions.id);
  }

  getAlertType() {
    const {
      id,
      name,
      actionVariables
    } = this.alertOptions;
    return {
      id,
      name,
      actionGroups: [{
        id: 'default',
        name: _i18n.i18n.translate('xpack.monitoring.alerts.actionGroups.default', {
          defaultMessage: 'Default'
        })
      }],
      defaultActionGroupId: 'default',
      minimumLicenseRequired: 'basic',
      executor: options => this.execute(options),
      producer: 'monitoring',
      actionVariables: {
        context: actionVariables
      }
    };
  }

  getId() {
    var _this$rawAlert;

    return (_this$rawAlert = this.rawAlert) === null || _this$rawAlert === void 0 ? void 0 : _this$rawAlert.id;
  }

  async createIfDoesNotExist(alertsClient, actionsClient, actions) {
    const existingAlertData = await alertsClient.find({
      options: {
        search: this.alertOptions.id
      }
    });

    if (existingAlertData.total > 0) {
      const existingAlert = existingAlertData.data[0];
      return existingAlert;
    }

    const alertActions = [];

    for (const actionData of actions) {
      const action = await actionsClient.get({
        id: actionData.id
      });

      if (!action) {
        continue;
      }

      alertActions.push({
        group: 'default',
        id: actionData.id,
        params: {
          message: '{{context.internalShortMessage}}',
          ...actionData.config
        }
      });
    }

    const {
      defaultParams: params = {},
      name,
      id: alertTypeId,
      throttle = '1d',
      interval = '1m'
    } = this.alertOptions;
    return await alertsClient.create({
      data: {
        enabled: true,
        tags: [],
        params,
        consumer: 'monitoring',
        name,
        alertTypeId,
        throttle,
        notifyWhen: null,
        schedule: {
          interval
        },
        actions: alertActions
      }
    });
  }

  async getStates(alertsClient, id, filters) {
    const states = await alertsClient.getAlertState({
      id
    });

    if (!states || !states.alertInstances) {
      return {};
    }

    return Object.keys(states.alertInstances).reduce((accum, instanceId) => {
      if (!states.alertInstances) {
        return accum;
      }

      const alertInstance = states.alertInstances[instanceId];
      const filteredAlertInstance = this.filterAlertInstance(alertInstance, filters);

      if (filteredAlertInstance) {
        accum[instanceId] = filteredAlertInstance;

        if (filteredAlertInstance.state) {
          accum[instanceId].state = {
            alertStates: filteredAlertInstance.state.alertStates
          };
        }
      }

      return accum;
    }, {});
  }

  filterAlertInstance(alertInstance, filters, filterOnNodes = false) {
    var _alertInstance$state;

    if (!filterOnNodes) {
      return alertInstance;
    }

    const alertInstanceStates = (_alertInstance$state = alertInstance.state) === null || _alertInstance$state === void 0 ? void 0 : _alertInstance$state.alertStates;
    const nodeFilter = filters === null || filters === void 0 ? void 0 : filters.find(filter => filter.nodeUuid);

    if (!filters || !filters.length || !(alertInstanceStates !== null && alertInstanceStates !== void 0 && alertInstanceStates.length) || !(nodeFilter !== null && nodeFilter !== void 0 && nodeFilter.nodeUuid)) {
      return alertInstance;
    }

    const alertStates = alertInstanceStates.filter(({
      nodeId
    }) => nodeId === nodeFilter.nodeUuid);
    return {
      state: {
        alertStates
      }
    };
  }

  async execute({
    services,
    params,
    state
  }) {
    var _Globals$app$monitori;

    this.scopedLogger.debug(`Executing alert with params: ${JSON.stringify(params)} and state: ${JSON.stringify(state)}`);
    const useCallCluster = ((_Globals$app$monitori = _static_globals.Globals.app.monitoringCluster) === null || _Globals$app$monitori === void 0 ? void 0 : _Globals$app$monitori.callAsInternalUser) || services.callCluster;

    const callCluster = async (endpoint, clientParams, options) => {
      return await (0, _mb_safe_query.mbSafeQuery)(async () => useCallCluster(endpoint, clientParams, options));
    };

    const availableCcs = _static_globals.Globals.app.config.ui.ccs.enabled ? await (0, _fetch_available_ccs.fetchAvailableCcs)(callCluster) : [];
    const clusters = await this.fetchClusters(callCluster, params, availableCcs);
    const data = await this.fetchData(params, callCluster, clusters, availableCcs);
    return await this.processData(data, clusters, services, state);
  }

  async fetchClusters(callCluster, params, ccs) {
    let esIndexPattern = (0, _append_mb_index.appendMetricbeatIndex)(_static_globals.Globals.app.config, _constants.INDEX_PATTERN_ELASTICSEARCH);

    if (ccs !== null && ccs !== void 0 && ccs.length) {
      esIndexPattern = (0, _get_ccs_index_pattern.getCcsIndexPattern)(esIndexPattern, ccs);
    }

    if (!params.limit) {
      return await (0, _fetch_clusters.fetchClusters)(callCluster, esIndexPattern);
    }

    const limit = (0, _parse_duration.parseDuration)(params.limit);
    const rangeFilter = this.alertOptions.fetchClustersRange ? {
      timestamp: {
        format: 'epoch_millis',
        gte: +new Date() - limit - this.alertOptions.fetchClustersRange
      }
    } : undefined;
    return await (0, _fetch_clusters.fetchClusters)(callCluster, esIndexPattern, rangeFilter);
  }

  async fetchData(params, callCluster, clusters, availableCcs) {
    throw new Error('Child classes must implement `fetchData`');
  }

  async processData(data, clusters, services, state) {
    const currentUTC = +new Date();

    for (const cluster of clusters) {
      const nodes = data.filter(node => node.clusterUuid === cluster.clusterUuid);

      if (!nodes.length) {
        continue;
      }

      const firingNodeUuids = nodes.filter(node => node.shouldFire).map(node => node.meta.nodeId || node.meta.instanceId).join(',');
      const instanceId = `${this.alertOptions.id}:${cluster.clusterUuid}:${firingNodeUuids}`;
      const instance = services.alertInstanceFactory(instanceId);
      const newAlertStates = [];
      const key = this.alertOptions.accessorKey;

      for (const node of nodes) {
        if (!node.shouldFire) {
          continue;
        }

        const {
          meta
        } = node;
        const nodeState = this.getDefaultAlertState(cluster, node);

        if (key) {
          nodeState[key] = meta[key];
        }

        nodeState.nodeId = meta.nodeId || node.nodeId || meta.instanceId; // TODO: make these functions more generic, so it's node/item agnostic

        nodeState.nodeName = meta.itemLabel || meta.nodeName || node.nodeName || nodeState.nodeId;
        nodeState.itemLabel = meta.itemLabel;
        nodeState.meta = meta;
        nodeState.ui.triggeredMS = currentUTC;
        nodeState.ui.isFiring = true;
        nodeState.ui.severity = node.severity;
        nodeState.ui.message = this.getUiMessage(nodeState, node);
        newAlertStates.push(nodeState);
      }

      const alertInstanceState = {
        alertStates: newAlertStates
      };
      instance.replaceState(alertInstanceState);

      if (newAlertStates.length) {
        this.executeActions(instance, alertInstanceState, null, cluster);
        state.lastExecutedAction = currentUTC;
      }
    }

    state.lastChecked = currentUTC;
    return state;
  }

  getDefaultAlertState(cluster, item) {
    return {
      cluster,
      ccs: item.ccs,
      ui: {
        isFiring: false,
        message: null,
        severity: _enums.AlertSeverity.Success,
        triggeredMS: 0,
        lastCheckedMS: 0
      }
    };
  }

  getUiMessage(alertState, item) {
    throw new Error('Child classes must implement `getUiMessage`');
  }

  executeActions(instance, instanceState, item, cluster) {
    throw new Error('Child classes must implement `executeActions`');
  }

  createGlobalStateLink(link, clusterUuid, ccs) {
    const globalState = [`cluster_uuid:${clusterUuid}`];

    if (ccs) {
      globalState.push(`ccs:${ccs}`);
    }

    return `${_static_globals.Globals.app.url}/app/monitoring#/${link}?_g=(${globalState.toString()})`;
  }

}

exports.BaseAlert = BaseAlert;