"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allowRequest = void 0;

var _lodash = require("lodash");

var _url = require("url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isHostMatch = (actualHost, ruleHost) => {
  const hostParts = actualHost.split('.').reverse();
  const ruleParts = ruleHost.split('.').reverse();
  return (0, _lodash.every)(ruleParts, (part, idx) => part === hostParts[idx]);
};

const allowRequest = (url, rules) => {
  const parsed = (0, _url.parse)(url);

  if (!rules.length) {
    return true;
  } // Accumulator has three potential values here:
  // True => allow request, don't check other rules
  // False => reject request, don't check other rules
  // Undefined => Not yet known, proceed to next rule


  const allowed = rules.reduce((result, rule) => {
    if (typeof result === 'boolean') {
      return result;
    }

    const hostMatch = rule.host ? isHostMatch(parsed.host || '', rule.host) : true;
    const protocolMatch = rule.protocol ? parsed.protocol === rule.protocol : true;
    const isRuleMatch = hostMatch && protocolMatch;
    return isRuleMatch ? rule.allow : undefined;
  }, undefined);
  return typeof allowed !== 'undefined' ? allowed : false;
};

exports.allowRequest = allowRequest;