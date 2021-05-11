"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRules = void 0;

var _fp = require("lodash/fp");

var _validate = require("../../../../common/validate");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");

var _add_tags = require("./add_tags");

var _utils = require("./utils");

var _rule_status_saved_objects_client = require("../signals/rule_status_saved_objects_client");

var _rule_schemas = require("../schemas/rule_schemas");

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

class PatchError extends Error {
  constructor(message, statusCode) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    this.statusCode = statusCode;
  }

}

const patchRules = async ({
  alertsClient,
  author,
  buildingBlockType,
  savedObjectsClient,
  description,
  eventCategoryOverride,
  falsePositives,
  enabled,
  query,
  language,
  license,
  outputIndex,
  savedId,
  timelineId,
  timelineTitle,
  meta,
  filters,
  from,
  index,
  interval,
  maxSignals,
  riskScore,
  riskScoreMapping,
  ruleNameOverride,
  rule,
  name,
  severity,
  severityMapping,
  tags,
  threat,
  threshold,
  threatFilters,
  threatIndex,
  threatQuery,
  threatMapping,
  threatLanguage,
  concurrentSearches,
  itemsPerSearch,
  timestampOverride,
  to,
  type,
  references,
  note,
  version,
  exceptionsList,
  anomalyThreshold,
  machineLearningJobId,
  actions
}) => {
  var _actions$map;

  if (rule == null) {
    return null;
  }

  const calculatedVersion = (0, _utils.calculateVersion)(rule.params.immutable, rule.params.version, {
    author,
    buildingBlockType,
    description,
    eventCategoryOverride,
    falsePositives,
    query,
    language,
    license,
    outputIndex,
    savedId,
    timelineId,
    timelineTitle,
    meta,
    filters,
    from,
    index,
    interval,
    maxSignals,
    riskScore,
    riskScoreMapping,
    ruleNameOverride,
    name,
    severity,
    severityMapping,
    tags,
    threat,
    threshold,
    threatFilters,
    threatIndex,
    threatQuery,
    threatMapping,
    threatLanguage,
    concurrentSearches,
    itemsPerSearch,
    timestampOverride,
    to,
    type,
    references,
    version,
    note,
    exceptionsList,
    anomalyThreshold,
    machineLearningJobId
  });
  const nextParams = (0, _fp.defaults)({ ...rule.params
  }, {
    author,
    buildingBlockType,
    description,
    falsePositives,
    from,
    query,
    language,
    license,
    outputIndex,
    savedId,
    timelineId,
    timelineTitle,
    meta,
    filters,
    index,
    maxSignals,
    riskScore,
    riskScoreMapping,
    ruleNameOverride,
    severity,
    severityMapping,
    threat,
    threshold,
    threatFilters,
    threatIndex,
    threatQuery,
    threatMapping,
    threatLanguage,
    concurrentSearches,
    itemsPerSearch,
    timestampOverride,
    to,
    type,
    references,
    note,
    version: calculatedVersion,
    exceptionsList,
    anomalyThreshold,
    machineLearningJobId
  });
  const newRule = {
    tags: (0, _add_tags.addTags)(tags !== null && tags !== void 0 ? tags : rule.tags, rule.params.ruleId, rule.params.immutable),
    throttle: null,
    notifyWhen: null,
    name: (0, _utils.calculateName)({
      updatedName: name,
      originalName: rule.name
    }),
    schedule: {
      interval: (0, _utils.calculateInterval)(interval, rule.schedule.interval)
    },
    actions: (_actions$map = actions === null || actions === void 0 ? void 0 : actions.map(_transform_actions.transformRuleToAlertAction)) !== null && _actions$map !== void 0 ? _actions$map : rule.actions,
    params: (0, _utils.removeUndefined)(nextParams)
  };
  const [validated, errors] = (0, _validate.validate)(newRule, _rule_schemas.internalRuleUpdate);

  if (errors != null || validated === null) {
    throw new PatchError(`Applying patch would create invalid rule: ${errors}`, 400);
  }
  /**
   * TODO: Remove this use of `as` by utilizing the proper type
   */


  const update = await alertsClient.update({
    id: rule.id,
    data: validated
  });

  if (rule.enabled && enabled === false) {
    await alertsClient.disable({
      id: rule.id
    });
  } else if (!rule.enabled && enabled === true) {
    await alertsClient.enable({
      id: rule.id
    });
    const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
    const ruleCurrentStatus = await ruleStatusClient.find({
      perPage: 1,
      sortField: 'statusDate',
      sortOrder: 'desc',
      search: rule.id,
      searchFields: ['alertId']
    }); // set current status for this rule to be 'going to run'

    if (ruleCurrentStatus && ruleCurrentStatus.saved_objects.length > 0) {
      const currentStatusToDisable = ruleCurrentStatus.saved_objects[0];
      await ruleStatusClient.update(currentStatusToDisable.id, { ...currentStatusToDisable.attributes,
        status: 'going to run'
      });
    }
  } else {// enabled is null or undefined and we do not touch the rule
  }

  if (enabled != null) {
    return { ...update,
      enabled
    };
  } else {
    return update;
  }
};

exports.patchRules = patchRules;