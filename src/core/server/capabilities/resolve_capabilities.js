"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveCapabilities = exports.getCapabilitiesResolver = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getCapabilitiesResolver = (capabilities, switchers) => async (request, applications, useDefaultCapabilities) => {
  return resolveCapabilities(capabilities(), switchers(), request, applications, useDefaultCapabilities);
};

exports.getCapabilitiesResolver = getCapabilitiesResolver;

const resolveCapabilities = async (capabilities, switchers, request, applications, useDefaultCapabilities) => {
  const mergedCaps = (0, _lodash.cloneDeep)({ ...capabilities,
    navLinks: applications.reduce((acc, app) => ({ ...acc,
      [app]: true
    }), capabilities.navLinks)
  });
  return switchers.reduce(async (caps, switcher) => {
    const resolvedCaps = await caps;
    const changes = await switcher(request, resolvedCaps, useDefaultCapabilities);
    return recursiveApplyChanges(resolvedCaps, changes);
  }, Promise.resolve(mergedCaps));
};

exports.resolveCapabilities = resolveCapabilities;

function recursiveApplyChanges(destination, source) {
  return Object.keys(destination).map(key => {
    const orig = destination[key];
    const changed = source[key];

    if (changed == null) {
      return [key, orig];
    }

    if (typeof orig === 'object' && typeof changed === 'object') {
      return [key, recursiveApplyChanges(orig, changed)];
    }

    return [key, typeof orig === typeof changed ? changed : orig];
  }).reduce((acc, [key, value]) => ({ ...acc,
    [key]: value
  }), {});
}