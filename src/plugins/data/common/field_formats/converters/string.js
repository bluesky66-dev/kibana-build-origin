"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringFormat = void 0;

var _i18n = require("@kbn/i18n");

var _utils = require("../utils");

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

var _utils2 = require("../../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TRANSFORM_OPTIONS = [{
  kind: false,
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.none', {
    defaultMessage: '- None -'
  })
}, {
  kind: 'lower',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.lower', {
    defaultMessage: 'Lower Case'
  })
}, {
  kind: 'upper',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.upper', {
    defaultMessage: 'Upper Case'
  })
}, {
  kind: 'title',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.title', {
    defaultMessage: 'Title Case'
  })
}, {
  kind: 'short',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.short', {
    defaultMessage: 'Short Dots'
  })
}, {
  kind: 'base64',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.base64', {
    defaultMessage: 'Base64 Decode'
  })
}, {
  kind: 'urlparam',
  text: _i18n.i18n.translate('data.fieldFormats.string.transformOptions.url', {
    defaultMessage: 'URL Param Decode'
  })
}];
const DEFAULT_TRANSFORM_OPTION = false;

class StringFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      switch (this.param('transform')) {
        case 'lower':
          return String(val).toLowerCase();

        case 'upper':
          return String(val).toUpperCase();

        case 'title':
          return this.toTitleCase(val);

        case 'short':
          return (0, _utils2.shortenDottedString)(val);

        case 'base64':
          return this.base64Decode(val);

        case 'urlparam':
          return decodeURIComponent(val);

        default:
          return (0, _utils.asPrettyString)(val);
      }
    });
  }

  getParamDefaults() {
    return {
      transform: DEFAULT_TRANSFORM_OPTION
    };
  }

  base64Decode(val) {
    try {
      return Buffer.from(val, 'base64').toString('utf8');
    } catch (e) {
      return (0, _utils.asPrettyString)(val);
    }
  }

  toTitleCase(val) {
    return val.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}

exports.StringFormat = StringFormat;

_defineProperty(StringFormat, "id", _types2.FIELD_FORMAT_IDS.STRING);

_defineProperty(StringFormat, "title", _i18n.i18n.translate('data.fieldFormats.string.title', {
  defaultMessage: 'String'
}));

_defineProperty(StringFormat, "fieldType", [_types.KBN_FIELD_TYPES.NUMBER, _types.KBN_FIELD_TYPES.BOOLEAN, _types.KBN_FIELD_TYPES.DATE, _types.KBN_FIELD_TYPES.IP, _types.KBN_FIELD_TYPES.ATTACHMENT, _types.KBN_FIELD_TYPES.GEO_POINT, _types.KBN_FIELD_TYPES.GEO_SHAPE, _types.KBN_FIELD_TYPES.STRING, _types.KBN_FIELD_TYPES.MURMUR3, _types.KBN_FIELD_TYPES.UNKNOWN, _types.KBN_FIELD_TYPES.CONFLICT]);

_defineProperty(StringFormat, "transformOptions", TRANSFORM_OPTIONS);