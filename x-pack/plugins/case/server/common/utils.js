"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertUpdateRequest = createAlertUpdateRequest;
exports.countAlertsForID = exports.groupTotalAlertsByID = exports.countAlerts = exports.combineFilters = exports.nullUser = exports.defaultSortField = void 0;

var _api = require("../../common/api");

var _utils = require("../routes/api/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default sort field for querying saved objects.
 */


const defaultSortField = 'created_at';
/**
 * Default unknown user
 */

exports.defaultSortField = defaultSortField;
const nullUser = {
  username: null,
  full_name: null,
  email: null
};
/**
 * Adds the ids and indices to a map of statuses
 */

exports.nullUser = nullUser;

function createAlertUpdateRequest({
  comment,
  status
}) {
  return (0, _utils.getAlertInfoFromComments)([comment]).map(alert => ({ ...alert,
    status
  }));
}
/**
 * Combines multiple filter expressions using the specified operator and parenthesis if multiple expressions exist.
 * This will ignore empty string filters. If a single valid filter is found it will not wrap in parenthesis.
 *
 * @param filters an array of filters to combine using the specified operator
 * @param operator AND or OR
 */


const combineFilters = (filters, operator) => {
  var _noEmptyStrings$lengt;

  const noEmptyStrings = filters === null || filters === void 0 ? void 0 : filters.filter(value => value !== '');
  const joinedExp = noEmptyStrings === null || noEmptyStrings === void 0 ? void 0 : noEmptyStrings.join(` ${operator} `); // if undefined or an empty string

  if (!joinedExp) {
    return '';
  } else if (((_noEmptyStrings$lengt = noEmptyStrings === null || noEmptyStrings === void 0 ? void 0 : noEmptyStrings.length) !== null && _noEmptyStrings$lengt !== void 0 ? _noEmptyStrings$lengt : 0) > 1) {
    // if there were multiple filters, wrap them in ()
    return `(${joinedExp})`;
  } else {
    // return a single value not wrapped in ()
    return joinedExp;
  }
};
/**
 * Counts the total alert IDs within a single comment.
 */


exports.combineFilters = combineFilters;

const countAlerts = comment => {
  let totalAlerts = 0;

  if (comment.attributes.type === _api.CommentType.alert || comment.attributes.type === _api.CommentType.generatedAlert) {
    if (Array.isArray(comment.attributes.alertId)) {
      totalAlerts += comment.attributes.alertId.length;
    } else {
      totalAlerts++;
    }
  }

  return totalAlerts;
};
/**
 * Count the number of alerts for each id in the alert's references. This will result
 * in a map with entries for both the collection and the individual sub cases. So the resulting
 * size of the map will not equal the total number of sub cases.
 */


exports.countAlerts = countAlerts;

const groupTotalAlertsByID = ({
  comments
}) => {
  return comments.saved_objects.reduce((acc, alertsInfo) => {
    const alertTotalForComment = countAlerts(alertsInfo);

    for (const alert of alertsInfo.references) {
      if (alert.id) {
        const totalAlerts = acc.get(alert.id);

        if (totalAlerts !== undefined) {
          acc.set(alert.id, totalAlerts + alertTotalForComment);
        } else {
          acc.set(alert.id, alertTotalForComment);
        }
      }
    }

    return acc;
  }, new Map());
};
/**
 * Counts the total alert IDs for a single case or sub case ID.
 */


exports.groupTotalAlertsByID = groupTotalAlertsByID;

const countAlertsForID = ({
  comments,
  id
}) => {
  return groupTotalAlertsByID({
    comments
  }).get(id);
};

exports.countAlertsForID = countAlertsForID;