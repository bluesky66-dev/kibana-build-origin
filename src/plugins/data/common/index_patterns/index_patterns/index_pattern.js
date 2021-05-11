"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPattern = void 0;

var _lodash = _interopRequireWildcard(require("lodash"));

var _common = require("../../../../kibana_utils/common");

var _common2 = require("../../../common");

var _fields = require("../fields");

var _format_hit = require("./format_hit");

var _flatten_hit = require("./flatten_hit");

var _kbn_field_types = require("../../kbn_field_types");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IndexPattern {
  /**
   * Only used by rollup indices, used by rollup specific endpoint to load field list
   */

  /**
   * @deprecated
   * Deprecated. used by time range index patterns
   */

  /**
   * Type is used to identify rollup index patterns
   */

  /**
   * SavedObject version
   */

  /**
   * prevents errors when index pattern exists before indices
   */
  constructor({
    spec = {},
    fieldFormats,
    shortDotsEnable = false,
    metaFields = []
  }) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "title", '');

    _defineProperty(this, "fieldFormatMap", void 0);

    _defineProperty(this, "typeMeta", void 0);

    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "timeFieldName", void 0);

    _defineProperty(this, "intervalName", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "formatHit", void 0);

    _defineProperty(this, "formatField", void 0);

    _defineProperty(this, "flattenHit", void 0);

    _defineProperty(this, "metaFields", void 0);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "sourceFilters", void 0);

    _defineProperty(this, "originalSavedObjectBody", {});

    _defineProperty(this, "shortDotsEnable", false);

    _defineProperty(this, "fieldFormats", void 0);

    _defineProperty(this, "fieldAttrs", void 0);

    _defineProperty(this, "runtimeFieldMap", void 0);

    _defineProperty(this, "allowNoIndex", false);

    _defineProperty(this, "getOriginalSavedObjectBody", () => ({ ...this.originalSavedObjectBody
    }));

    _defineProperty(this, "resetOriginalSavedObjectBody", () => {
      this.originalSavedObjectBody = this.getAsSavedObjectBody();
    });

    _defineProperty(this, "getFieldAttrs", () => {
      const newFieldAttrs = { ...this.fieldAttrs
      };
      this.fields.forEach(field => {
        const attrs = {};
        let hasAttr = false;

        if (field.customLabel) {
          attrs.customLabel = field.customLabel;
          hasAttr = true;
        }

        if (field.count) {
          attrs.count = field.count;
          hasAttr = true;
        }

        if (hasAttr) {
          newFieldAttrs[field.name] = attrs;
        } else {
          delete newFieldAttrs[field.name];
        }
      });
      return newFieldAttrs;
    });

    _defineProperty(this, "setFieldFormat", (fieldName, format) => {
      this.fieldFormatMap[fieldName] = format;
    });

    _defineProperty(this, "deleteFieldFormat", fieldName => {
      delete this.fieldFormatMap[fieldName];
    });

    // set dependencies
    this.fieldFormats = fieldFormats; // set config

    this.shortDotsEnable = shortDotsEnable;
    this.metaFields = metaFields; // initialize functionality

    this.fields = (0, _fields.fieldList)([], this.shortDotsEnable);
    this.flattenHit = (0, _flatten_hit.flattenHitWrapper)(this, metaFields);
    this.formatHit = (0, _format_hit.formatHitProvider)(this, fieldFormats.getDefaultInstance(_common2.KBN_FIELD_TYPES.STRING));
    this.formatField = this.formatHit.formatField; // set values

    this.id = spec.id;
    this.fieldFormatMap = spec.fieldFormats || {};
    this.version = spec.version;
    this.title = spec.title || '';
    this.timeFieldName = spec.timeFieldName;
    this.sourceFilters = spec.sourceFilters;
    this.fields.replaceAll(Object.values(spec.fields || {}));
    this.type = spec.type;
    this.typeMeta = spec.typeMeta;
    this.fieldAttrs = spec.fieldAttrs || {};
    this.intervalName = spec.intervalName;
    this.allowNoIndex = spec.allowNoIndex || false;
    this.runtimeFieldMap = spec.runtimeFieldMap || {};
  }
  /**
   * Get last saved saved object fields
   */


  getComputedFields() {
    const scriptFields = {};

    if (!this.fields) {
      return {
        storedFields: ['*'],
        scriptFields,
        docvalueFields: [],
        runtimeFields: {}
      };
    } // Date value returned in "_source" could be in any number of formats
    // Use a docvalue for each date field to ensure standardized formats when working with date fields
    // indexPattern.flattenHit will override "_source" values when the same field is also defined in "fields"


    const docvalueFields = (0, _lodash.reject)(this.fields.getByType('date'), 'scripted').map(dateField => {
      return {
        field: dateField.name,
        format: dateField.esTypes && dateField.esTypes.indexOf('date_nanos') !== -1 ? 'strict_date_time' : 'date_time'
      };
    });
    (0, _lodash.each)(this.getScriptedFields(), function (field) {
      scriptFields[field.name] = {
        script: {
          source: field.script,
          lang: field.lang
        }
      };
    });
    return {
      storedFields: ['*'],
      scriptFields,
      docvalueFields,
      runtimeFields: this.runtimeFieldMap
    };
  }
  /**
   * Create static representation of index pattern
   */


  toSpec() {
    return {
      id: this.id,
      version: this.version,
      title: this.title,
      timeFieldName: this.timeFieldName,
      sourceFilters: this.sourceFilters,
      fields: this.fields.toSpec({
        getFormatterForField: this.getFormatterForField.bind(this)
      }),
      typeMeta: this.typeMeta,
      type: this.type,
      fieldFormats: this.fieldFormatMap,
      runtimeFieldMap: this.runtimeFieldMap,
      fieldAttrs: this.fieldAttrs,
      intervalName: this.intervalName,
      allowNoIndex: this.allowNoIndex
    };
  }
  /**
   * Get the source filtering configuration for that index.
   */


  getSourceFiltering() {
    return {
      excludes: this.sourceFilters && this.sourceFilters.map(filter => filter.value) || []
    };
  }
  /**
   * Add scripted field to field list
   *
   * @param name field name
   * @param script script code
   * @param fieldType
   * @param lang
   */


  async addScriptedField(name, script, fieldType = 'string') {
    const scriptedFields = this.getScriptedFields();

    const names = _lodash.default.map(scriptedFields, 'name');

    if (_lodash.default.includes(names, name)) {
      throw new _common.DuplicateField(name);
    }

    this.fields.add({
      name,
      script,
      type: fieldType,
      scripted: true,
      lang: 'painless',
      aggregatable: true,
      searchable: true,
      count: 0,
      readFromDocValues: false
    });
  }
  /**
   * Remove scripted field from field list
   * @param fieldName
   */


  removeScriptedField(fieldName) {
    const field = this.fields.getByName(fieldName);

    if (field) {
      this.fields.remove(field);
    }
  }

  getNonScriptedFields() {
    return [...this.fields.getAll().filter(field => !field.scripted)];
  }

  getScriptedFields() {
    return [...this.fields.getAll().filter(field => field.scripted)];
  }

  getIndex() {
    if (!this.isUnsupportedTimePattern()) {
      return this.title;
    } // Take a time-based interval index pattern title (like [foo-]YYYY.MM.DD[-bar]) and turn it
    // into the actual index (like foo-*-bar) by replacing anything not inside square brackets
    // with a *.


    const regex = /\[[^\]]*]/g; // Matches text inside brackets

    const splits = this.title.split(regex); // e.g. ['', 'YYYY.MM.DD', ''] from the above example

    const matches = this.title.match(regex) || []; // e.g. ['[foo-]', '[-bar]'] from the above example

    return splits.map((split, i) => {
      const match = i >= matches.length ? '' : matches[i].replace(/[\[\]]/g, '');
      return `${split.length ? '*' : ''}${match}`;
    }).join('');
  }

  isUnsupportedTimePattern() {
    return !!this.intervalName;
  }

  isTimeBased() {
    return !!this.timeFieldName && (!this.fields || !!this.getTimeField());
  }

  isTimeNanosBased() {
    const timeField = this.getTimeField();
    return timeField && timeField.esTypes && timeField.esTypes.indexOf('date_nanos') !== -1;
  }

  getTimeField() {
    if (!this.timeFieldName || !this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(this.timeFieldName);
  }

  getFieldByName(name) {
    if (!this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(name);
  }

  getAggregationRestrictions() {
    var _this$typeMeta;

    return (_this$typeMeta = this.typeMeta) === null || _this$typeMeta === void 0 ? void 0 : _this$typeMeta.aggs;
  }
  /**
   * Returns index pattern as saved object body for saving
   */


  getAsSavedObjectBody() {
    const fieldFormatMap = _lodash.default.isEmpty(this.fieldFormatMap) ? undefined : JSON.stringify(this.fieldFormatMap);
    const fieldAttrs = this.getFieldAttrs();
    const runtimeFieldMap = this.runtimeFieldMap;
    return {
      fieldAttrs: fieldAttrs ? JSON.stringify(fieldAttrs) : undefined,
      title: this.title,
      timeFieldName: this.timeFieldName,
      intervalName: this.intervalName,
      sourceFilters: this.sourceFilters ? JSON.stringify(this.sourceFilters) : undefined,
      fields: this.fields ? JSON.stringify(this.fields.filter(field => field.scripted)) : undefined,
      fieldFormatMap,
      type: this.type,
      typeMeta: this.typeMeta ? JSON.stringify(this.typeMeta) : undefined,
      allowNoIndex: this.allowNoIndex ? this.allowNoIndex : undefined,
      runtimeFieldMap: runtimeFieldMap ? JSON.stringify(runtimeFieldMap) : undefined
    };
  }
  /**
   * Provide a field, get its formatter
   * @param field
   */


  getFormatterForField(field) {
    const fieldFormat = this.getFormatterForFieldNoDefault(field.name);

    if (fieldFormat) {
      return fieldFormat;
    }

    return this.fieldFormats.getDefaultInstance(field.type, field.esTypes);
  }
  /**
   * Add a runtime field - Appended to existing mapped field or a new field is
   * created as appropriate
   * @param name Field name
   * @param runtimeField Runtime field definition
   */


  addRuntimeField(name, runtimeField) {
    const existingField = this.getFieldByName(name);

    if (existingField) {
      existingField.runtimeField = runtimeField;
    } else {
      this.fields.add({
        name,
        runtimeField,
        type: (0, _kbn_field_types.castEsToKbnFieldTypeName)(runtimeField.type),
        aggregatable: true,
        searchable: true,
        count: 0,
        readFromDocValues: false
      });
    }

    this.runtimeFieldMap[name] = runtimeField;
  }
  /**
   * Remove a runtime field - removed from mapped field or removed unmapped
   * field as appropriate
   * @param name Field name
   */


  removeRuntimeField(name) {
    const existingField = this.getFieldByName(name);

    if (existingField) {
      if (existingField.isMapped) {
        // mapped field, remove runtimeField def
        existingField.runtimeField = undefined;
      } else {
        // runtimeField only
        this.fields.remove(existingField);
      }
    }

    delete this.runtimeFieldMap[name];
  }
  /**
   * Get formatter for a given field name. Return undefined if none exists
   * @param field
   */


  getFormatterForFieldNoDefault(fieldname) {
    const formatSpec = this.fieldFormatMap[fieldname];

    if (formatSpec !== null && formatSpec !== void 0 && formatSpec.id) {
      return this.fieldFormats.getInstance(formatSpec.id, formatSpec.params);
    }
  }

  setFieldAttrs(fieldName, attrName, value) {
    if (!this.fieldAttrs[fieldName]) {
      this.fieldAttrs[fieldName] = {};
    }

    this.fieldAttrs[fieldName][attrName] = value;
  }

  setFieldCustomLabel(fieldName, customLabel) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCustomLabel = customLabel === null ? undefined : customLabel;

    if (fieldObject) {
      fieldObject.customLabel = newCustomLabel;
      return;
    }

    this.setFieldAttrs(fieldName, 'customLabel', newCustomLabel);
  }

  setFieldCount(fieldName, count) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCount = count === null ? undefined : count;

    if (fieldObject) {
      if (!newCount) fieldObject.deleteCount();else fieldObject.count = newCount;
      return;
    }

    this.setFieldAttrs(fieldName, 'count', newCount);
  }

}

exports.IndexPattern = IndexPattern;