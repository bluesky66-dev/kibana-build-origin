"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrepackagedRules = exports.addPrepackedRulesRoute = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _validate = require("../../../../../common/validate");

var _prepackaged_rules_schema = require("../../../../../common/detection_engine/schemas/response/prepackaged_rules_schema");

var _timeline = require("../../../../../common/types/timeline");

var _constants = require("../../../../../common/constants");

var _common = require("../../../timeline/routes/utils/common");

var _install_prepacked_timelines = require("../../../timeline/routes/utils/install_prepacked_timelines");

var _get_index_exists = require("../../index/get_index_exists");

var _get_prepackaged_rules = require("../../rules/get_prepackaged_rules");

var _install_prepacked_rules = require("../../rules/install_prepacked_rules");

var _update_prepacked_rules = require("../../rules/update_prepacked_rules");

var _get_rules_to_install = require("../../rules/get_rules_to_install");

var _get_rules_to_update = require("../../rules/get_rules_to_update");

var _get_existing_prepackaged_rules = require("../../rules/get_existing_prepackaged_rules");

var _utils = require("../utils");

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

const addPrepackedRulesRoute = (router, config, security) => {
  router.put({
    path: _constants.DETECTION_ENGINE_PREPACKAGED_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution'],
      timeout: {
        // FUNFACT: If we do not add a very long timeout what will happen
        // is that Chrome which receive a 408 error and then do a retry.
        // This retry can cause lots of connections to happen. Using a very
        // long timeout will ensure that Chrome does not do retries and saturate the connections.
        idleSocket: _moment.default.duration('1', 'hour').asMilliseconds()
      }
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, _);

    try {
      var _context$alerting, _context$securitySolu;

      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient || !alertsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const validated = await createPrepackagedRules(context, siemClient, alertsClient, frameworkRequest, config.maxTimelineImportExportSize);
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {}
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

exports.addPrepackedRulesRoute = addPrepackedRulesRoute;

class PrepackagedRulesError extends Error {
  constructor(message, statusCode) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    this.statusCode = statusCode;
  }

}

const createPrepackagedRules = async (context, siemClient, alertsClient, frameworkRequest, maxTimelineImportExportSize, exceptionsClient) => {
  var _prepackagedTimelines, _prepackagedTimelines2;

  const clusterClient = context.core.elasticsearch.legacy.client;
  const savedObjectsClient = context.core.savedObjects.client;
  const exceptionsListClient = context.lists != null ? context.lists.getExceptionListClient() : exceptionsClient;

  if (!siemClient || !alertsClient) {
    throw new PrepackagedRulesError('', 404);
  } // This will create the endpoint list if it does not exist yet


  if (exceptionsListClient != null) {
    await exceptionsListClient.createEndpointList();
  }

  const rulesFromFileSystem = (0, _get_prepackaged_rules.getPrepackagedRules)();
  const prepackagedRules = await (0, _get_existing_prepackaged_rules.getExistingPrepackagedRules)({
    alertsClient
  });
  const rulesToInstall = (0, _get_rules_to_install.getRulesToInstall)(rulesFromFileSystem, prepackagedRules);
  const rulesToUpdate = (0, _get_rules_to_update.getRulesToUpdate)(rulesFromFileSystem, prepackagedRules);
  const signalsIndex = siemClient.getSignalsIndex();

  if (rulesToInstall.length !== 0 || rulesToUpdate.length !== 0) {
    const signalsIndexExists = await (0, _get_index_exists.getIndexExists)(clusterClient.callAsCurrentUser, signalsIndex);

    if (!signalsIndexExists) {
      throw new PrepackagedRulesError(`Pre-packaged rules cannot be installed until the signals index is created: ${signalsIndex}`, 400);
    }
  }

  await Promise.all((0, _install_prepacked_rules.installPrepackagedRules)(alertsClient, rulesToInstall, signalsIndex));
  const timeline = await (0, _install_prepacked_timelines.installPrepackagedTimelines)(maxTimelineImportExportSize, frameworkRequest, true);
  const [prepackagedTimelinesResult, timelinesErrors] = (0, _validate.validate)(timeline, _timeline.importTimelineResultSchema);
  await (0, _update_prepacked_rules.updatePrepackagedRules)(alertsClient, savedObjectsClient, rulesToUpdate, signalsIndex);
  const prepackagedRulesOutput = {
    rules_installed: rulesToInstall.length,
    rules_updated: rulesToUpdate.length,
    timelines_installed: (_prepackagedTimelines = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_installed) !== null && _prepackagedTimelines !== void 0 ? _prepackagedTimelines : 0,
    timelines_updated: (_prepackagedTimelines2 = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_updated) !== null && _prepackagedTimelines2 !== void 0 ? _prepackagedTimelines2 : 0
  };
  const [validated, genericErrors] = (0, _validate.validate)(prepackagedRulesOutput, _prepackaged_rules_schema.prePackagedRulesAndTimelinesSchema);

  if (genericErrors != null && timelinesErrors != null) {
    throw new PrepackagedRulesError([genericErrors, timelinesErrors].filter(msg => msg != null).join(', '), 500);
  }

  return validated;
};

exports.createPrepackagedRules = createPrepackagedRules;