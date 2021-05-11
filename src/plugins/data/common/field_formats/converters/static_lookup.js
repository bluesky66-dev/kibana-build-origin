"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaticLookupFormat = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function convertLookupEntriesToMap(lookupEntries) {
  return lookupEntries.reduce((lookupMap, lookupEntry) => {
    lookupMap[lookupEntry.key] = lookupEntry.value;
    return lookupMap;
  }, {});
}

class StaticLookupFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      const lookupEntries = this.param('lookupEntries');
      const unknownKeyValue = this.param('unknownKeyValue');
      const lookupMap = convertLookupEntriesToMap(lookupEntries);
      return lookupMap[val] || unknownKeyValue || val;
    });
  }

  getParamDefaults() {
    return {
      lookupEntries: [{}],
      unknownKeyValue: null
    };
  }

}

exports.StaticLookupFormat = StaticLookupFormat;

_defineProperty(StaticLookupFormat, "id", _types2.FIELD_FORMAT_IDS.STATIC_LOOKUP);

_defineProperty(StaticLookupFormat, "title", _i18n.i18n.translate('data.fieldFormats.static_lookup.title', {
  defaultMessage: 'Static lookup'
}));

_defineProperty(StaticLookupFormat, "fieldType", [_types.KBN_FIELD_TYPES.STRING, _types.KBN_FIELD_TYPES.NUMBER, _types.KBN_FIELD_TYPES.IP, _types.KBN_FIELD_TYPES.BOOLEAN]);