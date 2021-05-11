"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _utils = require("../../routes/api/utils");

var _api = require("../../../common/api");

var _helpers = require("../../services/user_actions/helpers");

var _helpers2 = require("../../routes/api/cases/helpers");

var _saved_object_types = require("../../saved_object_types");

var _common = require("../../common");

var _error = require("../../common/error");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Throws an error if any of the requests attempt to update a collection style cases' status field.
 */


function throwIfUpdateStatusOfCollection(requests, casesMap) {
  const requestsUpdatingStatusOfCollection = requests.filter(req => {
    var _casesMap$get;

    return req.status !== undefined && ((_casesMap$get = casesMap.get(req.id)) === null || _casesMap$get === void 0 ? void 0 : _casesMap$get.attributes.type) === _api.CaseType.collection;
  });

  if (requestsUpdatingStatusOfCollection.length > 0) {
    const ids = requestsUpdatingStatusOfCollection.map(req => req.id);
    throw _boom.default.badRequest(`Updating the status of a collection is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update the case type field.
 */


function throwIfUpdateCaseType(requests) {
  const requestsUpdatingCaseType = requests.filter(req => req.type !== undefined);

  if (requestsUpdatingCaseType.length > 0) {
    const ids = requestsUpdatingCaseType.map(req => req.id);
    throw _boom.default.badRequest(`Updating the type of a case is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update a collection style case to an individual one.
 */


function throwIfUpdateTypeCollectionToIndividual(requests, casesMap) {
  const requestsUpdatingTypeCollectionToInd = requests.filter(req => {
    var _casesMap$get2;

    return req.type === _api.CaseType.individual && ((_casesMap$get2 = casesMap.get(req.id)) === null || _casesMap$get2 === void 0 ? void 0 : _casesMap$get2.attributes.type) === _api.CaseType.collection;
  });

  if (requestsUpdatingTypeCollectionToInd.length > 0) {
    const ids = requestsUpdatingTypeCollectionToInd.map(req => req.id);
    throw _boom.default.badRequest(`Converting a collection to an individual case is not allowed ids: [${ids.join(', ')}]`);
  }
}
/**
 * Throws an error if any of the requests attempt to update an individual style cases' type field to a collection
 * when alerts are attached to the case.
 */


async function throwIfInvalidUpdateOfTypeWithAlerts({
  requests,
  caseService,
  client
}) {
  const getAlertsForID = async caseToUpdate => {
    const alerts = await caseService.getAllCaseComments({
      client,
      id: caseToUpdate.id,
      options: {
        fields: [],
        // there should never be generated alerts attached to an individual case but we'll check anyway
        filter: `${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.alert} OR ${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.generatedAlert}`,
        page: 1,
        perPage: 1
      }
    });
    return {
      id: caseToUpdate.id,
      alerts
    };
  };

  const requestsUpdatingTypeField = requests.filter(req => req.type === _api.CaseType.collection);
  const casesAlertTotals = await Promise.all(requestsUpdatingTypeField.map(caseToUpdate => getAlertsForID(caseToUpdate))); // grab the cases that have at least one alert comment attached to them

  const typeUpdateWithAlerts = casesAlertTotals.filter(caseInfo => caseInfo.alerts.total > 0);

  if (typeUpdateWithAlerts.length > 0) {
    const ids = typeUpdateWithAlerts.map(req => req.id);
    throw _boom.default.badRequest(`Converting a case to a collection is not allowed when it has alert comments, ids: [${ids.join(', ')}]`);
  }
}
/**
 * Get the id from a reference in a comment for a specific type.
 */


function getID(comment, type) {
  var _comment$references$f;

  return (_comment$references$f = comment.references.find(ref => ref.type === type)) === null || _comment$references$f === void 0 ? void 0 : _comment$references$f.id;
}
/**
 * Gets all the alert comments (generated or user alerts) for the requested cases.
 */


async function getAlertComments({
  casesToSync,
  caseService,
  client
}) {
  const idsOfCasesToSync = casesToSync.map(casePatchReq => casePatchReq.id); // getAllCaseComments will by default get all the comments, unless page or perPage fields are set

  return caseService.getAllCaseComments({
    client,
    id: idsOfCasesToSync,
    includeSubCaseComments: true,
    options: {
      filter: `${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.alert} OR ${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.generatedAlert}`
    }
  });
}
/**
 * Returns a map of sub case IDs to their status. This uses a group of alert comments to determine which sub cases should
 * be retrieved. This is based on whether the comment is associated to a sub case.
 */


async function getSubCasesToStatus({
  totalAlerts,
  caseService,
  client
}) {
  const subCasesToRetrieve = totalAlerts.saved_objects.reduce((acc, alertComment) => {
    if ((0, _utils.isCommentRequestTypeAlertOrGenAlert)(alertComment.attributes) && alertComment.attributes.associationType === _api.AssociationType.subCase) {
      const id = getID(alertComment, _saved_object_types.SUB_CASE_SAVED_OBJECT);

      if (id !== undefined) {
        acc.add(id);
      }
    }

    return acc;
  }, new Set());
  const subCases = await caseService.getSubCases({
    ids: Array.from(subCasesToRetrieve.values()),
    client
  });
  return subCases.saved_objects.reduce((acc, subCase) => {
    // log about the sub cases that we couldn't find
    if (!subCase.error) {
      acc.set(subCase.id, subCase.attributes.status);
    }

    return acc;
  }, new Map());
}
/**
 * Returns what status the alert comment should have based on whether it is associated to a case or sub case.
 */


function getSyncStatusForComment({
  alertComment,
  casesToSyncToStatus,
  subCasesToStatus
}) {
  let status = _api.CaseStatuses.open;

  if (alertComment.attributes.associationType === _api.AssociationType.case) {
    var _casesToSyncToStatus$;

    const id = getID(alertComment, _saved_object_types.CASE_SAVED_OBJECT); // We should log if we can't find the status
    // attempt to get the case status from our cases to sync map if we found the ID otherwise default to open

    status = id !== undefined ? (_casesToSyncToStatus$ = casesToSyncToStatus.get(id)) !== null && _casesToSyncToStatus$ !== void 0 ? _casesToSyncToStatus$ : _api.CaseStatuses.open : _api.CaseStatuses.open;
  } else if (alertComment.attributes.associationType === _api.AssociationType.subCase) {
    var _subCasesToStatus$get;

    const id = getID(alertComment, _saved_object_types.SUB_CASE_SAVED_OBJECT);
    status = id !== undefined ? (_subCasesToStatus$get = subCasesToStatus.get(id)) !== null && _subCasesToStatus$get !== void 0 ? _subCasesToStatus$get : _api.CaseStatuses.open : _api.CaseStatuses.open;
  }

  return status;
}
/**
 * Updates the alert ID's status field based on the patch requests
 */


async function updateAlerts({
  casesWithSyncSettingChangedToOn,
  casesWithStatusChangedAndSynced,
  casesMap,
  caseService,
  client,
  caseClient
}) {
  /**
   * It's possible that a case ID can appear multiple times in each array. I'm intentionally placing the status changes
   * last so when the map is built we will use the last status change as the source of truth.
   */
  const casesToSync = [...casesWithSyncSettingChangedToOn, ...casesWithStatusChangedAndSynced]; // build a map of case id to the status it has
  // this will have collections in it but the alerts should be associated to sub cases and not collections so it shouldn't
  // matter.

  const casesToSyncToStatus = casesToSync.reduce((acc, caseInfo) => {
    var _ref, _caseInfo$status, _casesMap$get3;

    acc.set(caseInfo.id, (_ref = (_caseInfo$status = caseInfo.status) !== null && _caseInfo$status !== void 0 ? _caseInfo$status : (_casesMap$get3 = casesMap.get(caseInfo.id)) === null || _casesMap$get3 === void 0 ? void 0 : _casesMap$get3.attributes.status) !== null && _ref !== void 0 ? _ref : _api.CaseStatuses.open);
    return acc;
  }, new Map()); // get all the alerts for all the alert comments for all cases and collections. Collections themselves won't have any
  // but their sub cases could

  const totalAlerts = await getAlertComments({
    casesToSync,
    caseService,
    client
  }); // get a map of sub case id to the sub case status

  const subCasesToStatus = await getSubCasesToStatus({
    totalAlerts,
    client,
    caseService
  }); // create an array of requests that indicate the id, index, and status to update an alert

  const alertsToUpdate = totalAlerts.saved_objects.reduce((acc, alertComment) => {
    if ((0, _utils.isCommentRequestTypeAlertOrGenAlert)(alertComment.attributes)) {
      const status = getSyncStatusForComment({
        alertComment,
        casesToSyncToStatus,
        subCasesToStatus
      });
      acc.push(...(0, _common.createAlertUpdateRequest)({
        comment: alertComment.attributes,
        status
      }));
    }

    return acc;
  }, []);
  await caseClient.updateAlertsStatus({
    alerts: alertsToUpdate
  });
}

const update = async ({
  savedObjectsClient,
  caseService,
  userActionService,
  user,
  caseClient,
  cases,
  logger
}) => {
  const query = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesPatchRequestRt).decode(cases), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));

  try {
    const myCases = await caseService.getCases({
      client: savedObjectsClient,
      caseIds: query.cases.map(q => q.id)
    });
    let nonExistingCases = [];
    const conflictedCases = query.cases.filter(q => {
      const myCase = myCases.saved_objects.find(c => c.id === q.id);

      if (myCase && myCase.error) {
        nonExistingCases = [...nonExistingCases, q];
        return false;
      }

      return myCase == null || (myCase === null || myCase === void 0 ? void 0 : myCase.version) !== q.version;
    });

    if (nonExistingCases.length > 0) {
      throw _boom.default.notFound(`These cases ${nonExistingCases.map(c => c.id).join(', ')} do not exist. Please check you have the correct ids.`);
    }

    if (conflictedCases.length > 0) {
      throw _boom.default.conflict(`These cases ${conflictedCases.map(c => c.id).join(', ')} has been updated. Please refresh before saving additional updates.`);
    }

    const updateCases = query.cases.map(updateCase => {
      const currentCase = myCases.saved_objects.find(c => c.id === updateCase.id);
      const {
        connector,
        ...thisCase
      } = updateCase;
      return currentCase != null ? (0, _helpers2.getCaseToUpdate)(currentCase.attributes, { ...thisCase,
        ...(connector != null ? {
          connector: (0, _helpers2.transformCaseConnectorToEsConnector)(connector)
        } : {})
      }) : {
        id: thisCase.id,
        version: thisCase.version
      };
    });
    const updateFilterCases = updateCases.filter(updateCase => {
      const {
        id,
        version,
        ...updateCaseAttributes
      } = updateCase;
      return Object.keys(updateCaseAttributes).length > 0;
    });

    if (updateFilterCases.length <= 0) {
      throw _boom.default.notAcceptable('All update fields are identical to current version.');
    }

    const casesMap = myCases.saved_objects.reduce((acc, so) => {
      acc.set(so.id, so);
      return acc;
    }, new Map());
    throwIfUpdateCaseType(updateFilterCases);
    throwIfUpdateStatusOfCollection(updateFilterCases, casesMap);
    throwIfUpdateTypeCollectionToIndividual(updateFilterCases, casesMap);
    await throwIfInvalidUpdateOfTypeWithAlerts({
      requests: updateFilterCases,
      caseService,
      client: savedObjectsClient
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const updatedDt = new Date().toISOString();
    const updatedCases = await caseService.patchCases({
      client: savedObjectsClient,
      cases: updateFilterCases.map(thisCase => {
        const {
          id: caseId,
          version,
          ...updateCaseAttributes
        } = thisCase;
        let closedInfo = {};

        if (updateCaseAttributes.status && updateCaseAttributes.status === _api.CaseStatuses.closed) {
          closedInfo = {
            closed_at: updatedDt,
            closed_by: {
              email,
              full_name,
              username
            }
          };
        } else if (updateCaseAttributes.status && (updateCaseAttributes.status === _api.CaseStatuses.open || updateCaseAttributes.status === _api.CaseStatuses['in-progress'])) {
          closedInfo = {
            closed_at: null,
            closed_by: null
          };
        }

        return {
          caseId,
          updatedAttributes: { ...updateCaseAttributes,
            ...closedInfo,
            updated_at: updatedDt,
            updated_by: {
              email,
              full_name,
              username
            }
          },
          version
        };
      })
    }); // If a status update occurred and the case is synced then we need to update all alerts' status
    // attached to the case to the new status.

    const casesWithStatusChangedAndSynced = updateFilterCases.filter(caseToUpdate => {
      const currentCase = myCases.saved_objects.find(c => c.id === caseToUpdate.id);
      return currentCase != null && caseToUpdate.status != null && currentCase.attributes.status !== caseToUpdate.status && currentCase.attributes.settings.syncAlerts;
    }); // If syncAlerts setting turned on we need to update all alerts' status
    // attached to the case to the current status.

    const casesWithSyncSettingChangedToOn = updateFilterCases.filter(caseToUpdate => {
      var _caseToUpdate$setting;

      const currentCase = myCases.saved_objects.find(c => c.id === caseToUpdate.id);
      return currentCase != null && ((_caseToUpdate$setting = caseToUpdate.settings) === null || _caseToUpdate$setting === void 0 ? void 0 : _caseToUpdate$setting.syncAlerts) != null && currentCase.attributes.settings.syncAlerts !== caseToUpdate.settings.syncAlerts && caseToUpdate.settings.syncAlerts;
    }); // Update the alert's status to match any case status or sync settings changes

    await updateAlerts({
      casesWithStatusChangedAndSynced,
      casesWithSyncSettingChangedToOn,
      caseService,
      client: savedObjectsClient,
      caseClient,
      casesMap
    });
    const returnUpdatedCase = myCases.saved_objects.filter(myCase => updatedCases.saved_objects.some(updatedCase => updatedCase.id === myCase.id)).map(myCase => {
      var _updatedCase$version;

      const updatedCase = updatedCases.saved_objects.find(c => c.id === myCase.id);
      return (0, _utils.flattenCaseSavedObject)({
        savedObject: { ...myCase,
          ...updatedCase,
          attributes: { ...myCase.attributes,
            ...(updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.attributes)
          },
          references: myCase.references,
          version: (_updatedCase$version = updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : myCase.version
        }
      });
    });
    await userActionService.postUserActions({
      client: savedObjectsClient,
      actions: (0, _helpers.buildCaseUserActions)({
        originalCases: myCases.saved_objects,
        updatedCases: updatedCases.saved_objects,
        actionDate: updatedDt,
        actionBy: {
          email,
          full_name,
          username
        }
      })
    });
    return _api.CasesResponseRt.encode(returnUpdatedCase);
  } catch (error) {
    const idVersions = cases.cases.map(caseInfo => ({
      id: caseInfo.id,
      version: caseInfo.version
    }));
    throw (0, _error.createCaseError)({
      message: `Failed to update case, ids: ${JSON.stringify(idVersions)}: ${error}`,
      error,
      logger
    });
  }
};

exports.update = update;