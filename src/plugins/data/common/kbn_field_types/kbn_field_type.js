"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KbnFieldType = void 0;

var _types = require("./types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class KbnFieldType {
  constructor(options = {}) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "sortable", void 0);

    _defineProperty(this, "filterable", void 0);

    _defineProperty(this, "esTypes", void 0);

    this.name = options.name || _types.KBN_FIELD_TYPES.UNKNOWN;
    this.sortable = options.sortable || false;
    this.filterable = options.filterable || false;
    this.esTypes = Object.freeze((options.esTypes || []).slice());
  }

}

exports.KbnFieldType = KbnFieldType;