"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldFormatsService = void 0;

var _lodash = require("lodash");

var _field_formats = require("../../common/field_formats");

var _converters = require("./converters");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FieldFormatsService {
  constructor() {
    _defineProperty(this, "fieldFormatClasses", [_converters.DateFormat, _converters.DateNanosFormat, ..._field_formats.baseFormatters]);
  }

  setup() {
    return {
      register: customFieldFormat => this.fieldFormatClasses.push(customFieldFormat)
    };
  }

  start() {
    return {
      fieldFormatServiceFactory: async uiSettings => {
        const fieldFormatsRegistry = new _field_formats.FieldFormatsRegistry();
        const uiConfigs = await uiSettings.getAll();
        const registeredUiSettings = uiSettings.getRegistered();
        Object.keys(registeredUiSettings).forEach(key => {
          if ((0, _lodash.has)(uiConfigs, key) && registeredUiSettings[key].type === 'json') {
            uiConfigs[key] = JSON.parse(uiConfigs[key]);
          }
        });
        fieldFormatsRegistry.init(key => uiConfigs[key], {}, this.fieldFormatClasses);
        return fieldFormatsRegistry;
      }
    };
  }

}
/** @public */


exports.FieldFormatsService = FieldFormatsService;