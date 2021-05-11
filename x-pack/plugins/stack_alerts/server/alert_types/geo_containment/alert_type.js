"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertType = getAlertType;
exports.ParamsSchema = exports.RecoveryActionGroupId = exports.ActionGroupId = exports.GEO_CONTAINMENT_ID = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");

var _geo_containment = require("./geo_containment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GEO_CONTAINMENT_ID = '.geo-containment';
exports.GEO_CONTAINMENT_ID = GEO_CONTAINMENT_ID;
const ActionGroupId = 'Tracked entity contained';
exports.ActionGroupId = ActionGroupId;
const RecoveryActionGroupId = 'notGeoContained';
exports.RecoveryActionGroupId = RecoveryActionGroupId;

const actionVariableContextEntityIdLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextEntityIdLabel', {
  defaultMessage: 'The entity ID of the document that triggered the alert'
});

const actionVariableContextEntityDateTimeLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityDateTimeLabel', {
  defaultMessage: `The date the entity was recorded in the boundary`
});

const actionVariableContextEntityDocumentIdLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityDocumentIdLabel', {
  defaultMessage: 'The id of the contained entity document'
});

const actionVariableContextDetectionDateTimeLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextDetectionDateTimeLabel', {
  defaultMessage: 'The alert interval end time this change was recorded'
});

const actionVariableContextEntityLocationLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityLocationLabel', {
  defaultMessage: 'The location of the entity'
});

const actionVariableContextContainingBoundaryIdLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextContainingBoundaryIdLabel', {
  defaultMessage: 'The id of the boundary containing the entity'
});

const actionVariableContextContainingBoundaryNameLabel = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextContainingBoundaryNameLabel', {
  defaultMessage: 'The boundary the entity is currently located within'
});

const actionVariables = {
  context: [// Alert-specific data
  {
    name: 'entityId',
    description: actionVariableContextEntityIdLabel
  }, {
    name: 'entityDateTime',
    description: actionVariableContextEntityDateTimeLabel
  }, {
    name: 'entityDocumentId',
    description: actionVariableContextEntityDocumentIdLabel
  }, {
    name: 'detectionDateTime',
    description: actionVariableContextDetectionDateTimeLabel
  }, {
    name: 'entityLocation',
    description: actionVariableContextEntityLocationLabel
  }, {
    name: 'containingBoundaryId',
    description: actionVariableContextContainingBoundaryIdLabel
  }, {
    name: 'containingBoundaryName',
    description: actionVariableContextContainingBoundaryNameLabel
  }]
};

const ParamsSchema = _configSchema.schema.object({
  index: _configSchema.schema.string({
    minLength: 1
  }),
  indexId: _configSchema.schema.string({
    minLength: 1
  }),
  geoField: _configSchema.schema.string({
    minLength: 1
  }),
  entity: _configSchema.schema.string({
    minLength: 1
  }),
  dateField: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryType: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryIndexTitle: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryIndexId: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryGeoField: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryNameField: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  })),
  indexQuery: _configSchema.schema.maybe(_configSchema.schema.any({})),
  boundaryIndexQuery: _configSchema.schema.maybe(_configSchema.schema.any({}))
});

exports.ParamsSchema = ParamsSchema;

function getAlertType(logger) {
  const alertTypeName = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.alertTypeTitle', {
    defaultMessage: 'Tracking containment'
  });

  const actionGroupName = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionGroupContainmentMetTitle', {
    defaultMessage: 'Tracking containment met'
  });

  return {
    id: GEO_CONTAINMENT_ID,
    name: alertTypeName,
    actionGroups: [{
      id: ActionGroupId,
      name: actionGroupName
    }],
    recoveryActionGroup: {
      id: RecoveryActionGroupId,
      name: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.notGeoContained', {
        defaultMessage: 'No longer contained'
      })
    },
    defaultActionGroupId: ActionGroupId,
    executor: (0, _geo_containment.getGeoContainmentExecutor)(logger),
    producer: _common.STACK_ALERTS_FEATURE_ID,
    validate: {
      params: ParamsSchema
    },
    actionVariables,
    minimumLicenseRequired: 'gold'
  };
}