"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleActionsSavedObjectMigration = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isEmptyObject(obj) {
  for (const attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) {
      return false;
    }
  }

  return true;
}

const ruleActionsSavedObjectMigration = {
  '7.11.2': doc => {
    const {
      actions
    } = doc.attributes;
    const newActions = actions.reduce((acc, action) => {
      if (['.servicenow', '.jira', '.resilient'].includes(action.action_type_id) && action.params.subAction === 'pushToService') {
        var _incident, _action$params, _action$params$subAct; // Future developer, we needed to do that because when we created this migration
        // we forget to think about user already using 7.11.0 and having an incident attribute build the right way
        // IMPORTANT -> if you change this code please do the same inside of this file
        // x-pack/plugins/alerting/server/saved_objects/migrations.ts


        const subActionParamsIncident = (_incident = (_action$params = action.params) === null || _action$params === void 0 ? void 0 : (_action$params$subAct = _action$params.subActionParams) === null || _action$params$subAct === void 0 ? void 0 : _action$params$subAct.incident) !== null && _incident !== void 0 ? _incident : null;

        if (subActionParamsIncident != null && !isEmptyObject(subActionParamsIncident)) {
          return [...acc, action];
        }

        if (action.action_type_id === '.servicenow') {
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
        } else if (action.action_type_id === '.jira') {
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
        } else if (action.action_type_id === '.resilient') {
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
      },
      references: doc.references || []
    };
  }
};
exports.ruleActionsSavedObjectMigration = ruleActionsSavedObjectMigration;