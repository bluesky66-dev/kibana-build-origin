"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeTypeClassLabel = getNodeTypeClassLabel;

var _lookups = require("./lookups");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Note: currently only `node` and `master` are supported due to
 * https://github.com/elastic/x-pack-kibana/issues/608
 * @param {Object} node - a node object from getNodes / getNodeSummary
 * @param {Object} type - the node type calculated from `calculateNodeType`
 */


function getNodeTypeClassLabel(node, type) {
  const nodeType = node.master ? 'master' : type;
  const returnObj = {
    nodeType,
    nodeTypeLabel: _lookups.nodeTypeLabel[nodeType],
    nodeTypeClass: _lookups.nodeTypeClass[nodeType]
  };
  return returnObj;
}