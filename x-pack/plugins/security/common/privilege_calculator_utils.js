"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareActions = compareActions;
exports.areActionsFullyCovered = areActionsFullyCovered;

var _lodash = _interopRequireDefault(require("lodash"));

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
 * Given two sets of actions, where one set is known to be a subset of the other, this will
 * determine which set of actions is most permissive, using standard sorting return values:
 * -1: actions1 is most permissive
 *  1: actions2 is most permissive
 *
 * All privileges are hierarchal at this point.
 *
 * @param actionSet1
 * @param actionSet2
 */


function compareActions(actionSet1, actionSet2) {
  if (areActionsFullyCovered(actionSet1, actionSet2)) {
    return -1;
  }

  if (areActionsFullyCovered(actionSet2, actionSet1)) {
    return 1;
  }

  throw new Error(`Non-comparable action sets! Expected one set of actions to be a subset of the other!`);
}
/**
 * Given two sets of actions, this will determine if the first set fully covers the second set.
 * "fully covers" means that all of the actions granted by the second set are also granted by the first set.
 * @param actionSet1
 * @param actionSet2
 */


function areActionsFullyCovered(actionSet1, actionSet2) {
  const actionExpressions = actionSet1.map(actionToRegExp);
  const isFullyCovered = actionSet2.every(assigned => // Does any expression from the first set match this action in the second set?
  actionExpressions.some(exp => exp.test(assigned)));
  return isFullyCovered;
}

function actionToRegExp(action) {
  // Actions are strings that may or may not end with a wildcard ("*").
  // This will excape all characters in the action string that are not the wildcard character.
  // Each wildcard character is then turned into a ".*" before the entire thing is turned into a regexp.
  return new RegExp(action.split('*').map(part => _lodash.default.escapeRegExp(part)).join('.*'));
}