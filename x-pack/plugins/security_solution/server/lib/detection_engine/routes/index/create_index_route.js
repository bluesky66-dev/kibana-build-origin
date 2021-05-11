"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDetectionIndex = exports.createIndexRoute = void 0;

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _get_index_exists = require("../../index/get_index_exists");

var _get_policy_exists = require("../../index/get_policy_exists");

var _set_policy = require("../../index/set_policy");

var _set_template = require("../../index/set_template");

var _get_signals_template = require("./get_signals_template");

var _create_bootstrap_index = require("../../index/create_bootstrap_index");

var _migration_cleanup = require("../../migrations/migration_cleanup");

var _signals_policy = _interopRequireDefault(require("./signals_policy.json"));

var _check_template_version = require("./check_template_version");

var _get_index_version = require("./get_index_version");

var _helpers = require("../../migrations/helpers");

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

const createIndexRoute = router => {
  router.post({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$securitySolu;

      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      await createDetectionIndex(context, siemClient);
      return response.ok({
        body: {
          acknowledged: true
        }
      });
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.createIndexRoute = createIndexRoute;

class CreateIndexError extends Error {
  constructor(message, statusCode) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    this.statusCode = statusCode;
  }

}

const createDetectionIndex = async (context, siemClient) => {
  const clusterClient = context.core.elasticsearch.legacy.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const callCluster = clusterClient.callAsCurrentUser;

  if (!siemClient) {
    throw new CreateIndexError('', 404);
  }

  const index = siemClient.getSignalsIndex();
  await (0, _migration_cleanup.ensureMigrationCleanupPolicy)({
    alias: index,
    esClient
  });
  const policyExists = await (0, _get_policy_exists.getPolicyExists)(callCluster, index);

  if (!policyExists) {
    await (0, _set_policy.setPolicy)(callCluster, index, _signals_policy.default);
  }

  if (await (0, _check_template_version.templateNeedsUpdate)({
    alias: index,
    esClient
  })) {
    await (0, _set_template.setTemplate)(callCluster, index, (0, _get_signals_template.getSignalsTemplate)(index));
  }

  const indexExists = await (0, _get_index_exists.getIndexExists)(callCluster, index);

  if (indexExists) {
    const indexVersion = await (0, _get_index_version.getIndexVersion)(callCluster, index);

    if ((0, _helpers.isOutdated)({
      current: indexVersion,
      target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
    })) {
      await callCluster('indices.rollover', {
        alias: index
      });
    }
  } else {
    await (0, _create_bootstrap_index.createBootstrapIndex)(callCluster, index);
  }
};

exports.createDetectionIndex = createDetectionIndex;