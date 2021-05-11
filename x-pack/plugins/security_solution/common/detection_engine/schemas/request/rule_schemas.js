"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fullResponseSchema = exports.fullPatchSchema = exports.updateRulesSchema = exports.machineLearningUpdateSchema = exports.thresholdUpdateSchema = exports.savedQueryUpdateSchema = exports.queryUpdateSchema = exports.threatMatchUpdateSchema = exports.eqlUpdateSchema = exports.createRulesSchema = exports.machineLearningCreateSchema = exports.thresholdCreateSchema = exports.savedQueryCreateSchema = exports.queryCreateSchema = exports.threatMatchCreateSchema = exports.eqlCreateSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _lists = require("../types/lists");

var _threat_mapping = require("../types/threat_mapping");

var _schemas = require("../common/schemas");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.partial(defaultableFields))]);
};

const patchSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.partial(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.partial(defaultableFields))]);
};

const responseSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.type(defaultableFields))]);
};

const buildAPISchemas = params => {
  return {
    create: createSchema(params.required, params.optional, params.defaultable),
    patch: patchSchema(params.required, params.optional, params.defaultable),
    response: responseSchema(params.required, params.optional, params.defaultable)
  };
};

const commonParams = {
  required: {
    name: _schemas.name,
    description: _schemas.description,
    risk_score: _schemas.risk_score,
    severity: _schemas.severity
  },
  optional: {
    building_block_type: _schemas.building_block_type,
    note: _schemas.note,
    license: _schemas.license,
    output_index: _schemas.output_index,
    timeline_id: _schemas.timeline_id,
    timeline_title: _schemas.timeline_title,
    meta: _schemas.meta,
    rule_name_override: _schemas.rule_name_override,
    timestamp_override: _schemas.timestamp_override
  },
  defaultable: {
    tags: _schemas.tags,
    interval: _schemas.interval,
    enabled: _schemas.enabled,
    throttle: _schemas.throttleOrNull,
    actions: _schemas.actions,
    author: _schemas.author,
    false_positives: _schemas.false_positives,
    from: _schemas.from,
    rule_id: _schemas.rule_id,
    // maxSignals not used in ML rules but probably should be used
    max_signals: _schemas.max_signals,
    risk_score_mapping: _schemas.risk_score_mapping,
    severity_mapping: _schemas.severity_mapping,
    threat: _schemas.threats,
    to: _schemas.to,
    references: _schemas.references,
    version: _schemas.version,
    exceptions_list: _lists.listArray
  }
};
const {
  create: commonCreateParams,
  patch: commonPatchParams,
  response: commonResponseParams
} = buildAPISchemas(commonParams);
const eqlRuleParams = {
  required: {
    type: t.literal('eql'),
    language: t.literal('eql'),
    query: _schemas.query
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    event_category_override: _schemas.event_category_override
  },
  defaultable: {}
};
const {
  create: eqlCreateParams,
  patch: eqlPatchParams,
  response: eqlResponseParams
} = buildAPISchemas(eqlRuleParams);
const threatMatchRuleParams = {
  required: {
    type: t.literal('threat_match'),
    query: _schemas.query,
    threat_query: _threat_mapping.threat_query,
    threat_mapping: _threat_mapping.threat_mapping,
    threat_index: _threat_mapping.threat_index
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id,
    threat_filters: _threat_mapping.threat_filters,
    threat_indicator_path: _threat_mapping.threat_indicator_path,
    threat_language: t.keyof({
      kuery: null,
      lucene: null
    }),
    concurrent_searches: _threat_mapping.concurrent_searches,
    items_per_search: _threat_mapping.items_per_search
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: threatMatchCreateParams,
  patch: threatMatchPatchParams,
  response: threatMatchResponseParams
} = buildAPISchemas(threatMatchRuleParams);
const queryRuleParams = {
  required: {
    type: t.literal('query')
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id
  },
  defaultable: {
    query: _schemas.query,
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: queryCreateParams,
  patch: queryPatchParams,
  response: queryResponseParams
} = buildAPISchemas(queryRuleParams);
const savedQueryRuleParams = {
  required: {
    type: t.literal('saved_query'),
    saved_id: _schemas.saved_id
  },
  optional: {
    // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
    // if the saved object gets deleted for some reason
    index: _schemas.index,
    query: _schemas.query,
    filters: _schemas.filters
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: savedQueryCreateParams,
  patch: savedQueryPatchParams,
  response: savedQueryResponseParams
} = buildAPISchemas(savedQueryRuleParams);
const thresholdRuleParams = {
  required: {
    type: t.literal('threshold'),
    query: _schemas.query,
    threshold: _schemas.threshold
  },
  optional: {
    index: _schemas.index,
    filters: _schemas.filters,
    saved_id: _schemas.saved_id
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
};
const {
  create: thresholdCreateParams,
  patch: thresholdPatchParams,
  response: thresholdResponseParams
} = buildAPISchemas(thresholdRuleParams);
const machineLearningRuleParams = {
  required: {
    type: t.literal('machine_learning'),
    anomaly_threshold: _schemas.anomaly_threshold,
    machine_learning_job_id: _schemas.machine_learning_job_id
  },
  optional: {},
  defaultable: {}
};
const {
  create: machineLearningCreateParams,
  patch: machineLearningPatchParams,
  response: machineLearningResponseParams
} = buildAPISchemas(machineLearningRuleParams);
const createTypeSpecific = t.union([eqlCreateParams, threatMatchCreateParams, queryCreateParams, savedQueryCreateParams, thresholdCreateParams, machineLearningCreateParams]); // Convenience types for building specific types of rules

const eqlCreateSchema = t.intersection([eqlCreateParams, commonCreateParams]);
exports.eqlCreateSchema = eqlCreateSchema;
const threatMatchCreateSchema = t.intersection([threatMatchCreateParams, commonCreateParams]);
exports.threatMatchCreateSchema = threatMatchCreateSchema;
const queryCreateSchema = t.intersection([queryCreateParams, commonCreateParams]);
exports.queryCreateSchema = queryCreateSchema;
const savedQueryCreateSchema = t.intersection([savedQueryCreateParams, commonCreateParams]);
exports.savedQueryCreateSchema = savedQueryCreateSchema;
const thresholdCreateSchema = t.intersection([thresholdCreateParams, commonCreateParams]);
exports.thresholdCreateSchema = thresholdCreateSchema;
const machineLearningCreateSchema = t.intersection([machineLearningCreateParams, commonCreateParams]);
exports.machineLearningCreateSchema = machineLearningCreateSchema;
const createRulesSchema = t.intersection([commonCreateParams, createTypeSpecific]);
exports.createRulesSchema = createRulesSchema;
const eqlUpdateSchema = t.intersection([eqlCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.eqlUpdateSchema = eqlUpdateSchema;
const threatMatchUpdateSchema = t.intersection([threatMatchCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.threatMatchUpdateSchema = threatMatchUpdateSchema;
const queryUpdateSchema = t.intersection([queryCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.queryUpdateSchema = queryUpdateSchema;
const savedQueryUpdateSchema = t.intersection([savedQueryCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.savedQueryUpdateSchema = savedQueryUpdateSchema;
const thresholdUpdateSchema = t.intersection([thresholdCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.thresholdUpdateSchema = thresholdUpdateSchema;
const machineLearningUpdateSchema = t.intersection([machineLearningCreateParams, commonCreateParams, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.machineLearningUpdateSchema = machineLearningUpdateSchema;
const patchTypeSpecific = t.union([eqlPatchParams, threatMatchPatchParams, queryPatchParams, savedQueryPatchParams, thresholdPatchParams, machineLearningPatchParams]);
const responseTypeSpecific = t.union([eqlResponseParams, threatMatchResponseParams, queryResponseParams, savedQueryResponseParams, thresholdResponseParams, machineLearningResponseParams]);
const updateRulesSchema = t.intersection([commonCreateParams, createTypeSpecific, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.updateRulesSchema = updateRulesSchema;
const fullPatchSchema = t.intersection([commonPatchParams, patchTypeSpecific, t.exact(t.partial({
  id: _schemas.id
}))]);
exports.fullPatchSchema = fullPatchSchema;
const responseRequiredFields = {
  id: _schemas.id,
  immutable: _schemas.immutable,
  updated_at: _schemas.updated_at,
  updated_by: _schemas.updatedByOrNull,
  created_at: _schemas.created_at,
  created_by: _schemas.createdByOrNull
};
const responseOptionalFields = {
  status: _schemas.job_status,
  status_date: _schemas.status_date,
  last_success_at: _schemas.last_success_at,
  last_success_message: _schemas.last_success_message,
  last_failure_at: _schemas.last_failure_at,
  last_failure_message: _schemas.last_failure_message
};
const fullResponseSchema = t.intersection([commonResponseParams, responseTypeSpecific, t.exact(t.type(responseRequiredFields)), t.exact(t.partial(responseOptionalFields))]);
exports.fullResponseSchema = fullResponseSchema;