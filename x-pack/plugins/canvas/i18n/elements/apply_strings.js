"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyElementStrings = void 0;

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function takes a set of Canvas Element specification factories, runs them,
 * replaces relevant strings (if available) and returns a new factory.  We do this
 * so the specifications themselves have no dependency on i18n, for clarity for both
 * our and external plugin developers.
 */


const applyElementStrings = elements => {
  const elementStrings = (0, _index.getElementStrings)();
  return elements.map(spec => {
    const result = spec();
    const {
      name
    } = result;
    const strings = elementStrings[name]; // If we have registered strings for this spec, we should replace any that are available.

    if (strings) {
      const {
        displayName,
        help
      } = strings; // If the function has a registered help string, replace it on the spec.

      if (help) {
        result.help = help;
      }

      if (displayName) {
        result.displayName = displayName;
      }
    }

    return () => result;
  });
};

exports.applyElementStrings = applyElementStrings;