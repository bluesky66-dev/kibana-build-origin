"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNodeType = calculateNodeType;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Determine node type using following rules:
 *  - data only node: --node.master=false
 *  - master only node: --node.data=false
 *  - client only node: --node.data=false --node.master=false
 *  https://www.elastic.co/guide/en/elasticsearch/reference/2.x/modules-node.html
 */


function calculateNodeType(node, masterNodeId) {
  const attrs = node.attributes || {};

  function mightBe(attr) {
    return attr === 'true' || (0, _lodash.isUndefined)(attr);
  }

  function isNot(attr) {
    return attr === 'false';
  }

  if (node.uuid !== undefined && node.uuid === masterNodeId) {
    return 'master';
  }

  if ((0, _lodash.includes)(node.node_ids, masterNodeId)) {
    return 'master';
  }

  if (isNot(attrs.data) && isNot(attrs.master)) {
    return 'client';
  }

  if (mightBe(attrs.master) && isNot(attrs.data)) {
    return 'master_only';
  }

  if (mightBe(attrs.data) && isNot(attrs.master)) {
    return 'data';
  }

  return 'node';
}