"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSeverityFromMapping = void 0;

var _fp = require("lodash/fp");

var _schemas = require("../../../../../common/detection_engine/schemas/common/schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const severitySortMapping = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3
};
const ECS_SEVERITY_FIELD = 'event.severity';

const buildSeverityFromMapping = ({
  eventSource,
  severity,
  severityMapping
}) => {
  if (!severityMapping || !severityMapping.length) {
    return defaultSeverity(severity);
  }

  let severityMatch; // Sort the SeverityMapping from low to high, so last match (highest severity) is used

  const severityMappingSorted = severityMapping.sort((a, b) => severitySortMapping[a.severity] - severitySortMapping[b.severity]);
  severityMappingSorted.forEach(mapping => {
    const mappingField = mapping.field;
    const mappingValue = mapping.value;
    const eventValue = (0, _fp.get)(mappingField, eventSource);
    const normalizedEventValues = normalizeEventValue(mappingField, eventValue);
    const normalizedMappingValue = normalizeMappingValue(mappingField, mappingValue);

    if (normalizedEventValues.has(normalizedMappingValue)) {
      severityMatch = { ...mapping
      };
    }
  });

  if (severityMatch != null && _schemas.severity.is(severityMatch.severity)) {
    return overriddenSeverity(severityMatch.severity, severityMatch.field);
  }

  return defaultSeverity(severity);
};

exports.buildSeverityFromMapping = buildSeverityFromMapping;

function normalizeMappingValue(eventField, mappingValue) {
  // TODO: Expand by verifying fieldType from index via doc._index
  // Till then, explicit parsing of event.severity (long) to number. If not ECS, this could be
  // another datatype, but until we can lookup datatype we must assume number for the Elastic
  // Endpoint Security rule to function correctly
  if (eventField === ECS_SEVERITY_FIELD) {
    return Math.floor(Number(mappingValue));
  }

  return mappingValue;
}

function normalizeEventValue(eventField, eventValue) {
  const eventValues = Array.isArray(eventValue) ? eventValue : [eventValue];
  const validValues = eventValues.filter(v => isValidValue(eventField, v));
  const finalValues = eventField === ECS_SEVERITY_FIELD ? validValues : validValues.map(String);
  return new Set(finalValues);
}

function isValidValue(eventField, value) {
  return eventField === ECS_SEVERITY_FIELD ? isValidNumber(value) : isValidNumber(value) || isValidString(value);
}

function isValidString(value) {
  return typeof value === 'string';
}

function isValidNumber(value) {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

function defaultSeverity(value) {
  return {
    severity: value,
    severityMeta: {}
  };
}

function overriddenSeverity(value, field) {
  return {
    severity: value,
    severityMeta: {
      severityOverrideField: field
    }
  };
}