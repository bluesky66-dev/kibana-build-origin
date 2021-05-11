"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ESGlobPatterns = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const valid = /.*/;

class ESGlobPatterns {
  static createRegExPatterns(globPattern) {
    if (globPattern === '*') {
      return {
        contains: valid,
        negate: valid
      };
    }

    globPattern = globPattern.toLowerCase();
    globPattern = globPattern.replace(/[ \\\/?"<>|#]/g, '');
    const patternsArr = globPattern.split(',');
    const containPatterns = [];
    const negatePatterns = [];
    patternsArr.forEach(pattern => {
      if (pattern.charAt(0) === '-') {
        negatePatterns.push(ESGlobPatterns.createESGlobRegExStr(pattern.slice(1)));
      } else {
        containPatterns.push(ESGlobPatterns.createESGlobRegExStr(pattern));
      }
    });
    const contains = containPatterns.length ? new RegExp(containPatterns.join('|'), 'gi') : valid;
    const negate = negatePatterns.length ? new RegExp(`^((?!(${negatePatterns.join('|')})).)*$`, 'gi') : valid;
    return {
      contains,
      negate
    };
  }

  static isValid(value, patterns) {
    const {
      contains = valid,
      negate = valid
    } = patterns;
    return new RegExp(contains).test(value) && new RegExp(negate).test(value);
  }

  static createESGlobRegExStr(pattern) {
    const patternsArr = pattern.split('*');
    const firstItem = patternsArr.shift();
    const lastItem = patternsArr.pop();
    const start = firstItem !== null && firstItem !== void 0 && firstItem.length ? `(^${ESGlobPatterns.escapeStr(firstItem)})` : '';
    const mid = patternsArr.map(group => `(.*${ESGlobPatterns.escapeStr(group)})`);
    const end = lastItem !== null && lastItem !== void 0 && lastItem.length ? `(.*${ESGlobPatterns.escapeStr(lastItem)}$)` : '';
    const regExArr = ['(^', start, ...mid, end, ')'];
    return regExArr.join('');
  }

  static escapeStr(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

}

exports.ESGlobPatterns = ESGlobPatterns;