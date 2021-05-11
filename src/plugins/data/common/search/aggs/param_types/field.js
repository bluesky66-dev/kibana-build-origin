"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldParamType = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../plugins/kibana_utils/common");

var _base = require("./base");

var _utils = require("../utils");

var _fields = require("../../../index_patterns/fields");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const filterByType = (0, _utils.propFilter)('type');

class FieldParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);

    _defineProperty(this, "required", true);

    _defineProperty(this, "scriptable", true);

    _defineProperty(this, "filterFieldTypes", void 0);

    _defineProperty(this, "onlyAggregatable", void 0);

    _defineProperty(this, "getAvailableFields", aggConfig => {
      const fields = aggConfig.getIndexPattern().fields;
      const filteredFields = fields.filter(field => {
        const {
          onlyAggregatable,
          scriptable,
          filterFieldTypes
        } = this;

        if (onlyAggregatable && (!field.aggregatable || (0, _fields.isNestedField)(field)) || !scriptable && field.scripted) {
          return false;
        }

        return filterByType([field], filterFieldTypes).length !== 0;
      });
      return filteredFields;
    });

    this.filterFieldTypes = config.filterFieldTypes || '*';
    this.onlyAggregatable = config.onlyAggregatable !== false;

    if (!config.write) {
      this.write = (aggConfig, output) => {
        const field = aggConfig.getField();

        if (!field) {
          throw new TypeError(_i18n.i18n.translate('data.search.aggs.paramTypes.field.requiredFieldParameterErrorMessage', {
            defaultMessage: '{fieldParameter} is a required parameter',
            values: {
              fieldParameter: '"field"'
            }
          }));
        }

        if (field.scripted) {
          output.params.script = {
            source: field.script,
            lang: field.lang
          };
        } else {
          output.params.field = field.name;
        }
      };
    }

    this.serialize = field => {
      return field.name;
    };

    this.deserialize = (fieldName, aggConfig) => {
      if (!aggConfig) {
        throw new Error('aggConfig was not provided to FieldParamType deserialize function');
      }

      const field = aggConfig.getIndexPattern().fields.getByName(fieldName);

      if (!field) {
        throw new _common.SavedObjectNotFound('index-pattern-field', fieldName);
      }

      const validField = this.getAvailableFields(aggConfig).find(f => f.name === fieldName);

      if (!validField) {
        var _aggConfig$type;

        throw new Error(_i18n.i18n.translate('data.search.aggs.paramTypes.field.invalidSavedFieldParameterErrorMessage', {
          defaultMessage: 'Saved field "{fieldParameter}" of index pattern "{indexPatternTitle}" is invalid for use with the "{aggType}" aggregation. Please select a new field.',
          values: {
            fieldParameter: fieldName,
            aggType: aggConfig === null || aggConfig === void 0 ? void 0 : (_aggConfig$type = aggConfig.type) === null || _aggConfig$type === void 0 ? void 0 : _aggConfig$type.title,
            indexPatternTitle: aggConfig.getIndexPattern().title
          }
        }));
      }

      return validField;
    };
  }
  /**
   * filter the fields to the available ones
   */


}

exports.FieldParamType = FieldParamType;