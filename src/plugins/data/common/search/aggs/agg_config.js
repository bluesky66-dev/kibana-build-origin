"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggConfig = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _i18n = require("@kbn/i18n");

var _agg_params = require("./agg_params");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AggConfig {
  /**
   * Ensure that all of the objects in the list have ids, the objects
   * and list are modified by reference.
   *
   * @param  {array[object]} list - a list of objects, objects can be anything really
   * @return {array} - the list that was passed in
   */
  static ensureIds(list) {
    const have = [];
    const haveNot = [];
    list.forEach(function (obj) {
      (obj.id ? have : haveNot).push(obj);
    });
    let nextId = AggConfig.nextId(have);
    haveNot.forEach(function (obj) {
      obj.id = String(nextId++);
    });
    return list;
  }
  /**
   * Calculate the next id based on the ids in this list
   *
   * @return {array} list - a list of objects with id properties
   */


  static nextId(list) {
    return 1 + list.reduce(function (max, obj) {
      return Math.max(max, +obj.id || 0);
    }, 0);
  }

  constructor(aggConfigs, opts) {
    _defineProperty(this, "aggConfigs", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "params", void 0);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "brandNew", void 0);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "__type", void 0);

    _defineProperty(this, "__typeDecorations", void 0);

    _defineProperty(this, "subAggs", []);

    this.aggConfigs = aggConfigs;
    this.id = String(opts.id || AggConfig.nextId(aggConfigs.aggs));
    this.enabled = typeof opts.enabled === 'boolean' ? opts.enabled : true; // start with empty params so that checks in type/schema setters don't freak
    // because this.params is undefined

    this.params = {}; // setters

    this.setType(opts.type);

    if (opts.schema) {
      this.schema = opts.schema;
    } // set the params to the values from opts, or just to the defaults


    this.setParams(opts.params || {}); // @ts-ignore

    this.__type = this.__type;
  }
  /**
   * Write the current values to this.params, filling in the defaults as we go
   *
   * @param  {object} [from] - optional object to read values from,
   *                         used when initializing
   * @return {undefined}
   */


  setParams(from) {
    from = from || this.params || {};
    const to = this.params = {};
    this.getAggParams().forEach(aggParam => {
      let val = from[aggParam.name];

      if (val == null) {
        if (aggParam.default == null) return;

        if (!_lodash.default.isFunction(aggParam.default)) {
          val = aggParam.default;
        } else {
          val = aggParam.default(this);
          if (val == null) return;
        }
      }

      if (aggParam.deserialize) {
        const isTyped = _lodash.default.isFunction(aggParam.valueType);

        const isType = isTyped && val instanceof aggParam.valueType;

        const isObject = !isTyped && _lodash.default.isObject(val);

        const isDeserialized = isType || isObject;

        if (!isDeserialized) {
          val = aggParam.deserialize(val, this);
        }

        to[aggParam.name] = val;
        return;
      }

      to[aggParam.name] = _lodash.default.cloneDeep(val);
    });
  }

  getParam(key) {
    return _lodash.default.get(this.params, key);
  }

  write(aggs) {
    return (0, _agg_params.writeParams)(this.type.params, this, aggs);
  }

  isFilterable() {
    return _lodash.default.isFunction(this.type.createFilter);
  }

  createFilter(key, params = {}) {
    const createFilter = this.type.createFilter;

    if (!createFilter) {
      throw new TypeError(`The "${this.type.title}" aggregation does not support filtering.`);
    }

    const field = this.getField();
    const label = this.getFieldDisplayName();

    if (field && !field.filterable) {
      let message = `The "${label}" field can not be used for filtering.`;

      if (field.scripted) {
        message = `The "${label}" field is scripted and can not be used for filtering.`;
      }

      throw new TypeError(message);
    }

    return createFilter(this, key, params);
  }
  /**
   *  Hook for pre-flight logic, see AggType#onSearchRequestStart
   *  @param {SearchSource} searchSource
   *  @param {ISearchOptions} options
   *  @return {Promise<undefined>}
   */


  onSearchRequestStart(searchSource, options) {
    if (!this.type) {
      return Promise.resolve();
    }

    return Promise.all(this.type.params.map(param => param.modifyAggConfigOnSearchRequestStart(this, searchSource, options)));
  }
  /**
   * Convert this aggConfig to its dsl syntax.
   *
   * Adds params and adhoc subaggs to a pojo, then returns it
   *
   * @param  {AggConfigs} aggConfigs - the config object to convert
   * @return {void|Object} - if the config has a dsl representation, it is
   *                         returned, else undefined is returned
   */


  toDsl(aggConfigs) {
    if (this.type.hasNoDsl) return;
    const output = this.write(aggConfigs);
    const configDsl = {};
    configDsl[this.type.dslName || this.type.name] = output.params; // if the config requires subAggs, write them to the dsl as well

    if (this.subAggs.length) {
      if (!output.subAggs) output.subAggs = this.subAggs;else output.subAggs.push(...this.subAggs);
    }

    if (output.subAggs) {
      const subDslLvl = configDsl.aggs || (configDsl.aggs = {});
      output.subAggs.forEach(function nestAdhocSubAggs(subAggConfig) {
        subDslLvl[subAggConfig.id] = subAggConfig.toDsl(aggConfigs);
      });
    }

    if (output.parentAggs) {
      const subDslLvl = configDsl.parentAggs || (configDsl.parentAggs = {});
      output.parentAggs.forEach(function nestAdhocSubAggs(subAggConfig) {
        subDslLvl[subAggConfig.id] = subAggConfig.toDsl(aggConfigs);
      });
    }

    return configDsl;
  }
  /**
   * @returns Returns a serialized representation of an AggConfig.
   */


  serialize() {
    const params = this.params;

    const outParams = _lodash.default.transform(this.getAggParams(), (out, aggParam) => {
      let val = params[aggParam.name]; // don't serialize undefined/null values

      if (val == null) return;
      if (aggParam.serialize) val = aggParam.serialize(val, this);
      if (val == null) return; // to prevent accidental leaking, we will clone all complex values

      out[aggParam.name] = _lodash.default.cloneDeep(val);
    }, {});

    return {
      id: this.id,
      enabled: this.enabled,
      type: this.type && this.type.name,
      params: outParams,
      ...(this.schema && {
        schema: this.schema
      })
    };
  }
  /**
   * @deprecated - Use serialize() instead.
   */


  toJSON() {
    return this.serialize();
  }
  /**
   * Returns a serialized field format for the field used in this agg.
   * This can be passed to fieldFormats.deserialize to get the field
   * format instance.
   *
   * @public
   */


  toSerializedFieldFormat() {
    return this.type ? this.type.getSerializedFormat(this) : {};
  }
  /**
   * @returns Returns an ExpressionAst representing the this agg type.
   */


  toExpressionAst() {
    const functionName = this.type && this.type.expressionName;
    const {
      type,
      ...rest
    } = this.serialize();

    if (!functionName || !rest.params) {
      // Return undefined - there is no matching expression function for this agg
      return;
    } // Go through each of the params and convert to an array of expression args.


    const params = Object.entries(rest.params).reduce((acc, [key, value]) => {
      const deserializedParam = this.getAggParams().find(p => p.name === key);

      if (deserializedParam && deserializedParam.toExpressionAst) {
        // If the param provides `toExpressionAst`, we call it with the value
        const paramExpressionAst = deserializedParam.toExpressionAst(this.getParam(key));

        if (paramExpressionAst) {
          acc[key] = [paramExpressionAst];
        }
      } else if (value && Array.isArray(value)) {
        // For array params which don't provide `toExpressionAst`, we stringify
        // if it's an array of objects, otherwise we keep it as-is
        const definedValues = value.filter(v => typeof v !== 'undefined' && v !== null);
        acc[key] = typeof definedValues[0] === 'object' ? [JSON.stringify(definedValues)] : definedValues;
      } else if (typeof value === 'object') {
        // For object params which don't provide `toExpressionAst`, we stringify
        acc[key] = [JSON.stringify(value)];
      } else if (typeof value !== 'undefined') {
        // Everything else just gets stored in an array if it is defined
        acc[key] = [value];
      }

      return acc;
    }, {});
    return {
      type: 'expression',
      chain: [{
        type: 'function',
        function: functionName,
        arguments: { ...params,
          // Expression args which are provided to all functions
          id: [this.id],
          enabled: [this.enabled],
          ...(this.schema ? {
            schema: [this.schema]
          } : {}) // schema may be undefined

        }
      }]
    };
  }

  getAggParams() {
    return [...(_lodash.default.hasIn(this, 'type.params') ? this.type.params : [])];
  }

  getRequestAggs() {
    return this.type && this.type.getRequestAggs(this) || [this];
  }

  getResponseAggs() {
    return this.type && this.type.getResponseAggs(this) || [this];
  }

  getValue(bucket) {
    return this.type.getValue(this, bucket);
  }

  getKey(bucket, key) {
    if (this.type.getKey) {
      return this.type.getKey(bucket, key, this);
    } else {
      return '';
    }
  }

  getFieldDisplayName() {
    const field = this.getField();
    return field ? field.displayName || this.fieldName() : '';
  }

  getField() {
    return this.params.field;
  }
  /**
   * Returns the bucket path containing the main value the agg will produce
   * (e.g. for sum of bytes it will point to the sum, for median it will point
   *  to the 50 percentile in the percentile multi value bucket)
   */


  getValueBucketPath() {
    return this.type.getValueBucketPath(this);
  }

  makeLabel(percentageMode = false) {
    if (this.params.customLabel) {
      return this.params.customLabel;
    }

    if (!this.type) return '';
    return percentageMode ? _i18n.i18n.translate('data.search.aggs.percentageOfLabel', {
      defaultMessage: 'Percentage of {label}',
      values: {
        label: this.type.makeLabel(this)
      }
    }) : `${this.type.makeLabel(this)}`;
  }

  getIndexPattern() {
    return this.aggConfigs.indexPattern;
  }

  getTimeRange() {
    return this.aggConfigs.timeRange;
  }

  fieldName() {
    const field = this.getField();
    return field ? field.name : '';
  }

  fieldIsTimeField() {
    const indexPattern = this.getIndexPattern();
    if (!indexPattern) return false;
    const timeFieldName = indexPattern.timeFieldName;
    return timeFieldName && this.fieldName() === timeFieldName;
  }

  get type() {
    return this.__type;
  }

  set type(type) {
    if (this.__typeDecorations) {
      _lodash.default.forOwn(this.__typeDecorations, (prop, name) => {
        // @ts-ignore
        delete this[name];
      });
    }

    if (type && _lodash.default.isFunction(type.decorateAggConfig)) {
      this.__typeDecorations = type.decorateAggConfig();
      Object.defineProperties(this, this.__typeDecorations);
    }

    this.__type = type;
    let availableFields = [];
    const fieldParam = this.type && this.type.params.find(p => p.type === 'field');

    if (fieldParam) {
      // @ts-ignore
      availableFields = fieldParam.getAvailableFields(this);
    } // clear out the previous params except for a few special ones


    this.setParams({
      // almost every agg has fields, so we try to persist that when type changes
      field: availableFields.find(field => field.name === this.getField())
    });
  }

  setType(type) {
    this.type = type;
  }

}

exports.AggConfig = AggConfig;