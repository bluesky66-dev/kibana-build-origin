"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMetadataToLastPath = exports.isIPv4 = void 0;

var _lodash = require("lodash");

var _inventory_models = require("../../../../common/inventory_models");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isIPv4 = subject => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(subject);

exports.isIPv4 = isIPv4;

const applyMetadataToLastPath = (series, node, snapshotRequest, source) => {
  // First we need to find a row with metadata
  const rowWithMeta = series.rows.find(row => row[_constants.META_KEY] && (0, _lodash.isArray)(row[_constants.META_KEY]) && row[_constants.META_KEY].length || 0);

  if (rowWithMeta) {
    // We need just the first doc, there should only be one
    const firstMetaDoc = (0, _lodash.first)(rowWithMeta[_constants.META_KEY]); // We also need the last path to add the metadata to

    const lastPath = (0, _lodash.last)(node.path);

    if (firstMetaDoc && lastPath) {
      // We will need the inventory fields so we can use the field paths to get
      // the values from the metadata document
      const inventoryFields = (0, _inventory_models.findInventoryFields)(snapshotRequest.nodeType, source.configuration.fields); // Set the label as the name and fallback to the id OR path.value

      lastPath.label = (0, _lodash.get)(firstMetaDoc, inventoryFields.name, lastPath.value); // If the inventory fields contain an ip address, we need to try and set that
      // on the path object. IP addersses are typically stored as multiple fields. We will
      // use the first IPV4 address we find.

      if (inventoryFields.ip) {
        const ipAddresses = (0, _lodash.get)(firstMetaDoc, inventoryFields.ip);

        if (Array.isArray(ipAddresses)) {
          lastPath.ip = ipAddresses.find(isIPv4) || null;
        } else if (typeof ipAddresses === 'string') {
          lastPath.ip = ipAddresses;
        }
      }

      return [...node.path.slice(0, node.path.length - 1), lastPath];
    }
  }

  return node.path;
};

exports.applyMetadataToLastPath = applyMetadataToLastPath;