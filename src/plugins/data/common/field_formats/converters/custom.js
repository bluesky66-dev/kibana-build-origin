"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCustomFieldFormat = void 0;

var _field_format = require("../field_format");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createCustomFieldFormat = convert => {
  var _class, _temp;

  return _temp = _class = class CustomFieldFormat extends _field_format.FieldFormat {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "textConvert", convert);
    }

  }, _defineProperty(_class, "id", _types.FIELD_FORMAT_IDS.CUSTOM), _temp;
};

exports.createCustomFieldFormat = createCustomFieldFormat;