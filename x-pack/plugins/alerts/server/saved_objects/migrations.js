"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations = getMigrations;
exports.isAnyActionSupportIncidents = exports.LEGACY_LAST_MODIFIED_VERSION = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SIEM_APP_ID = 'securitySolution';
const SIEM_SERVER_APP_ID = 'siem';
const LEGACY_LAST_MODIFIED_VERSION = 'pre-7.10.0';
exports.LEGACY_LAST_MODIFIED_VERSION = LEGACY_LAST_MODIFIED_VERSION;
const SUPPORT_INCIDENTS_ACTION_TYPES = ['.servicenow', '.jira', '.resilient'];

const isAnyActionSupportIncidents = doc => doc.attributes.actions.some(action => SUPPORT_INCIDENTS_ACTION_TYPES.includes(action.actionTypeId));

exports.isAnyActionSupportIncidents = isAnyActionSupportIncidents;

function getMigrations(encryptedSavedObjects) {
  const migrationWhenRBACWasIntroduced = encryptedSavedObjects.createMigration(function shouldBeMigrated(doc) {
    // migrate all documents in 7.10 in order to add the "meta" RBAC field
    return true;
  }, pipeMigrations(markAsLegacyAndChangeConsumer, setAlertIdAsDefaultDedupkeyOnPagerDutyActions, initializeExecutionStatus));
  const migrationAlertUpdatedAtAndNotifyWhen = encryptedSavedObjects.createMigration( // migrate all documents in 7.11 in order to add the "updatedAt" and "notifyWhen" fields
  doc => true, pipeMigrations(setAlertUpdatedAtDate, setNotifyWhen));
  const migrationActions7112 = encryptedSavedObjects.createMigration(doc => isAnyActionSupportIncidents(doc), pipeMigrations(restructureConnectorsThatSupportIncident));
  return {
    '7.10.0': executeMigrationWithErrorHandling(migrationWhenRBACWasIntroduced, '7.10.0'),
    '7.11.0': executeMigrationWithErrorHandling(migrationAlertUpdatedAtAndNotifyWhen, '7.11.0'),
    '7.11.2': executeMigrationWithErrorHandling(migrationActions7112, '7.11.2')
  };
}

function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`encryptedSavedObject ${version} migration failed for alert ${doc.id} with error: ${ex.message}`, {
        alertDocument: doc
      });
    }

    return doc;
  };
}

const setAlertUpdatedAtDate = doc => {
  const updatedAt = doc.updated_at || doc.attributes.createdAt;
  return { ...doc,
    attributes: { ...doc.attributes,
      updatedAt
    }
  };
};

const setNotifyWhen = doc => {
  const notifyWhen = doc.attributes.throttle ? 'onThrottleInterval' : 'onActiveAlert';
  return { ...doc,
    attributes: { ...doc.attributes,
      notifyWhen
    }
  };
};

const consumersToChange = new Map(Object.entries({
  alerting: 'alerts',
  metrics: 'infrastructure',
  [SIEM_APP_ID]: SIEM_SERVER_APP_ID
}));

function markAsLegacyAndChangeConsumer(doc) {
  var _consumersToChange$ge;

  const {
    attributes: {
      consumer
    }
  } = doc;
  return { ...doc,
    attributes: { ...doc.attributes,
      consumer: (_consumersToChange$ge = consumersToChange.get(consumer)) !== null && _consumersToChange$ge !== void 0 ? _consumersToChange$ge : consumer,
      // mark any alert predating 7.10 as a legacy alert
      meta: {
        versionApiKeyLastmodified: LEGACY_LAST_MODIFIED_VERSION
      }
    }
  };
}

function setAlertIdAsDefaultDedupkeyOnPagerDutyActions(doc) {
  const {
    attributes
  } = doc;
  return { ...doc,
    attributes: { ...attributes,
      ...(attributes.actions ? {
        actions: attributes.actions.map(action => {
          var _action$params$dedupK;

          if (action.actionTypeId !== '.pagerduty' || action.params.eventAction === 'trigger') {
            return action;
          }

          return { ...action,
            params: { ...action.params,
              dedupKey: (_action$params$dedupK = action.params.dedupKey) !== null && _action$params$dedupK !== void 0 ? _action$params$dedupK : '{{alertId}}'
            }
          };
        })
      } : {})
    }
  };
}

function initializeExecutionStatus(doc) {
  const {
    attributes
  } = doc;
  return { ...doc,
    attributes: { ...attributes,
      executionStatus: {
        status: 'pending',
        lastExecutionDate: new Date().toISOString(),
        error: null
      }
    }
  };
}

function isEmptyObject(obj) {
  for (const attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) {
      return false;
    }
  }

  return true;
}

function restructureConnectorsThatSupportIncident(doc) {
  const {
    actions
  } = doc.attributes;
  const newActions = actions.reduce((acc, action) => {
    if (['.servicenow', '.jira', '.resilient'].includes(action.actionTypeId) && action.params.subAction === 'pushToService') {
      var _incident, _action$params, _action$params$subAct; // Future developer, we needed to do that because when we created this migration
      // we forget to think about user already using 7.11.0 and having an incident attribute build the right way
      // IMPORTANT -> if you change this code please do the same inside of this file
      // x-pack/plugins/alerting/server/saved_objects/migrations.ts


      const subActionParamsIncident = (_incident = (_action$params = action.params) === null || _action$params === void 0 ? void 0 : (_action$params$subAct = _action$params.subActionParams) === null || _action$params$subAct === void 0 ? void 0 : _action$params$subAct.incident) !== null && _incident !== void 0 ? _incident : null;

      if (subActionParamsIncident != null && !isEmptyObject(subActionParamsIncident)) {
        return [...acc, action];
      }

      if (action.actionTypeId === '.servicenow') {
        const {
          title,
          comments,
          comment,
          description,
          severity,
          urgency,
          impact,
          short_description: shortDescription
        } = action.params.subActionParams;
        return [...acc, { ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                short_description: shortDescription !== null && shortDescription !== void 0 ? shortDescription : title,
                description,
                severity,
                urgency,
                impact
              },
              comments: [...(comments !== null && comments !== void 0 ? comments : []), ...(comment != null ? [{
                commentId: '1',
                comment
              }] : [])]
            }
          }
        }];
      } else if (action.actionTypeId === '.jira') {
        const {
          title,
          comments,
          description,
          issueType,
          priority,
          labels,
          parent,
          summary
        } = action.params.subActionParams;
        return [...acc, { ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                summary: summary !== null && summary !== void 0 ? summary : title,
                description,
                issueType,
                priority,
                labels,
                parent
              },
              comments
            }
          }
        }];
      } else if (action.actionTypeId === '.resilient') {
        const {
          title,
          comments,
          description,
          incidentTypes,
          severityCode,
          name
        } = action.params.subActionParams;
        return [...acc, { ...action,
          params: {
            subAction: 'pushToService',
            subActionParams: {
              incident: {
                name: name !== null && name !== void 0 ? name : title,
                description,
                incidentTypes,
                severityCode
              },
              comments
            }
          }
        }];
      }
    }

    return [...acc, action];
  }, []);
  return { ...doc,
    attributes: { ...doc.attributes,
      actions: newActions
    }
  };
}

function pipeMigrations(...migrations) {
  return doc => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc), doc);
}