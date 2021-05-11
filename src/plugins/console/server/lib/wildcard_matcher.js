"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WildcardMatcher = void 0;

var _minimatch = require("minimatch");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WildcardMatcher {
  constructor(wildcardPattern, emptyVal) {
    this.wildcardPattern = wildcardPattern;
    this.emptyVal = emptyVal;

    _defineProperty(this, "pattern", void 0);

    _defineProperty(this, "matcher", void 0);

    this.pattern = String(this.wildcardPattern || '*');
    this.matcher = new _minimatch.Minimatch(this.pattern, {
      noglobstar: true,
      dot: true,
      nocase: true,
      matchBase: true,
      nocomment: true
    });
  }

  match(candidate) {
    const empty = !candidate || candidate === this.emptyVal;

    if (empty && this.pattern === '*') {
      return true;
    }

    return this.matcher.match(candidate || '');
  }

}

exports.WildcardMatcher = WildcardMatcher;