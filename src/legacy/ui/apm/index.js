"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmConfig = getApmConfig;

var _apm = require("../../../apm");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _getConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apmEnabled = (_getConfig = (0, _apm.getConfig)()) === null || _getConfig === void 0 ? void 0 : _getConfig.active;

function getApmConfig(requestPath) {
  if (!apmEnabled) {
    return null;
  }

  const config = { ...(0, _apm.getConfig)('kibana-frontend'),
    pageLoadTransactionName: requestPath
  };
  /**
   * Get current active backend transaction to make distrubuted tracing
   * work for rendering the app
   */

  const backendTransaction = _elasticApmNode.default.currentTransaction;

  if (backendTransaction) {
    const {
      sampled,
      traceId
    } = backendTransaction;
    return { ...config,
      ...{
        pageLoadTraceId: traceId,
        pageLoadSampled: sampled,
        pageLoadSpanId: backendTransaction.ensureParentId()
      }
    };
  }

  return config;
}