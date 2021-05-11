"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSource = exports.searchSourceRequiredUiSettings = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _normalize_sort_request = require("./normalize_sort_request");

var _common = require("../../../../kibana_utils/common");

var _fetch = require("./fetch");

var _common2 = require("../../../common");

var _field_formats = require("../../../common/field_formats");

var _legacy = require("./legacy");

var _extract_references = require("./extract_references");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
const searchSourceRequiredUiSettings = ['dateFormat:tz', _common2.UI_SETTINGS.COURIER_BATCH_SEARCHES, _common2.UI_SETTINGS.COURIER_CUSTOM_REQUEST_PREFERENCE, _common2.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX, _common2.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS, _common2.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE, _common2.UI_SETTINGS.DOC_HIGHLIGHT, _common2.UI_SETTINGS.META_FIELDS, _common2.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS, _common2.UI_SETTINGS.QUERY_STRING_OPTIONS, _common2.UI_SETTINGS.SEARCH_INCLUDE_FROZEN, _common2.UI_SETTINGS.SORT_OPTIONS];
exports.searchSourceRequiredUiSettings = searchSourceRequiredUiSettings;

/** @public **/
class SearchSource {
  constructor(fields = {}, dependencies) {
    _defineProperty(this, "id", (0, _lodash.uniqueId)('data_source'));

    _defineProperty(this, "searchStrategyId", void 0);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "requestStartHandlers", []);

    _defineProperty(this, "inheritOptions", {});

    _defineProperty(this, "history", []);

    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "dependencies", void 0);

    _defineProperty(this, "getFieldName", fld => typeof fld === 'string' ? fld : fld.field);

    this.fields = fields;
    this.dependencies = dependencies;
  }
  /** ***
   * PUBLIC API
   *****/

  /**
   * internal, dont use
   * @param searchStrategyId
   */


  setPreferredSearchStrategyId(searchStrategyId) {
    this.searchStrategyId = searchStrategyId;
  }
  /**
   * sets value to a single search source field
   * @param field: field name
   * @param value: value for the field
   */


  setField(field, value) {
    if (value == null) {
      return this.removeField(field);
    }

    this.fields[field] = value;
    return this;
  }
  /**
   * remove field
   * @param field: field name
   */


  removeField(field) {
    delete this.fields[field];
    return this;
  }
  /**
   * Internal, do not use. Overrides all search source fields with the new field array.
   *
   * @private
   * @param newFields New field array.
   */


  setFields(newFields) {
    this.fields = newFields;
    return this;
  }
  /**
   * returns search source id
   */


  getId() {
    return this.id;
  }
  /**
   * returns all search source fields
   */


  getFields(recurse = false) {
    let thisFilter = this.fields.filter; // type is single value, array, or function

    if (thisFilter) {
      if (typeof thisFilter === 'function') {
        thisFilter = thisFilter() || []; // type is single value or array
      }

      if (Array.isArray(thisFilter)) {
        thisFilter = [...thisFilter];
      } else {
        thisFilter = [thisFilter];
      }
    } else {
      thisFilter = [];
    }

    if (recurse) {
      const parent = this.getParent();

      if (parent) {
        const parentFields = parent.getFields(recurse);
        let parentFilter = parentFields.filter; // type is single value, array, or function

        if (parentFilter) {
          if (typeof parentFilter === 'function') {
            parentFilter = parentFilter() || []; // type is single value or array
          }

          if (Array.isArray(parentFilter)) {
            thisFilter.push(...parentFilter);
          } else {
            thisFilter.push(parentFilter);
          }
        } // add combined filters to the fields


        const thisFields = { ...this.fields,
          filter: thisFilter
        };
        return { ...parentFields,
          ...thisFields
        };
      }
    }

    return { ...this.fields
    };
  }
  /**
   * Gets a single field from the fields
   */


  getField(field, recurse = true) {
    if (!recurse || this.fields[field] !== void 0) {
      return this.fields[field];
    }

    const parent = this.getParent();
    return parent && parent.getField(field);
  }
  /**
   * Get the field from our own fields, don't traverse up the chain
   */


  getOwnField(field) {
    return this.getField(field, false);
  }
  /**
   * @deprecated Don't use.
   */


  create() {
    return new SearchSource({}, this.dependencies);
  }
  /**
   * creates a copy of this search source (without its children)
   */


  createCopy() {
    const newSearchSource = new SearchSource({}, this.dependencies);
    newSearchSource.setFields({ ...this.fields
    }); // when serializing the internal fields we lose the internal classes used in the index
    // pattern, so we have to set it again to workaround this behavior

    newSearchSource.setField('index', this.getField('index'));
    newSearchSource.setParent(this.getParent());
    return newSearchSource;
  }
  /**
   * creates a new child search source
   * @param options
   */


  createChild(options = {}) {
    const childSearchSource = new SearchSource({}, this.dependencies);
    childSearchSource.setParent(this, options);
    return childSearchSource;
  }
  /**
   * Set a searchSource that this source should inherit from
   * @param  {SearchSource} parent - the parent searchSource
   * @param  {SearchSourceOptions} options - the inherit options
   * @return {this} - chainable
   */


  setParent(parent, options = {}) {
    this.parent = parent;
    this.inheritOptions = options;
    return this;
  }
  /**
   * Get the parent of this SearchSource
   * @return {undefined|searchSource}
   */


  getParent() {
    return this.parent;
  }
  /**
   * Fetch this source from Elasticsearch, returning an observable over the response(s)
   * @param options
   */


  fetch$(options = {}) {
    const {
      getConfig
    } = this.dependencies;
    return (0, _rxjs.defer)(() => this.requestIsStarting(options)).pipe((0, _operators.switchMap)(() => {
      const searchRequest = this.flatten();
      this.history = [searchRequest];
      return getConfig(_common2.UI_SETTINGS.COURIER_BATCH_SEARCHES) ? (0, _rxjs.from)(this.legacyFetch(searchRequest, options)) : this.fetchSearch$(searchRequest, options);
    }), (0, _operators.tap)(response => {
      // TODO: Remove casting when https://github.com/elastic/elasticsearch-js/issues/1287 is resolved
      if (response.error) {
        throw new _fetch.RequestFailure(null, response);
      }
    }));
  }
  /**
   * Fetch this source and reject the returned Promise on error
   * @deprecated Use fetch$ instead
   */


  fetch(options = {}) {
    return this.fetch$(options).toPromise();
  }
  /**
   *  Add a handler that will be notified whenever requests start
   *  @param  {Function} handler
   *  @return {undefined}
   */


  onRequestStart(handler) {
    this.requestStartHandlers.push(handler);
  }
  /**
   * Returns body contents of the search request, often referred as query DSL.
   */


  async getSearchRequestBody() {
    const searchRequest = await this.flatten();
    return searchRequest.body;
  }
  /**
   * Completely destroy the SearchSource.
   * @return {undefined}
   */


  destroy() {
    this.requestStartHandlers.length = 0;
  }
  /** ****
   * PRIVATE APIS
   ******/

  /**
   * Run a search using the search service
   * @return {Promise<SearchResponse<unknown>>}
   */


  fetchSearch$(searchRequest, options) {
    const {
      search,
      getConfig,
      onResponse
    } = this.dependencies;
    const params = (0, _fetch.getSearchParamsFromRequest)(searchRequest, {
      getConfig
    });
    return search({
      params,
      indexType: searchRequest.indexType
    }, options).pipe((0, _operators.map)(({
      rawResponse
    }) => onResponse(searchRequest, rawResponse)));
  }
  /**
   * Run a search using the search service
   * @return {Promise<SearchResponse<unknown>>}
   */


  async legacyFetch(searchRequest, options) {
    const {
      getConfig,
      legacy,
      onResponse
    } = this.dependencies;
    return await (0, _legacy.fetchSoon)(searchRequest, { ...(this.searchStrategyId && {
        searchStrategyId: this.searchStrategyId
      }),
      ...options
    }, {
      getConfig,
      onResponse,
      legacy
    });
  }
  /**
   *  Called by requests of this search source when they are started
   *  @param options
   *  @return {Promise<undefined>}
   */


  requestIsStarting(options = {}) {
    const handlers = [...this.requestStartHandlers]; // If callParentStartHandlers has been set to true, we also call all
    // handlers of parent search sources.

    if (this.inheritOptions.callParentStartHandlers) {
      let searchSource = this.getParent();

      while (searchSource) {
        handlers.push(...searchSource.requestStartHandlers);
        searchSource = searchSource.getParent();
      }
    }

    return Promise.all(handlers.map(fn => fn(this, options)));
  }
  /**
   * Used to merge properties into the data within ._flatten().
   * The data is passed in and modified by the function
   *
   * @param  {object} data - the current merged data
   * @param  {*} val - the value at `key`
   * @param  {*} key - The key of `val`
   * @return {undefined}
   */


  mergeProp(data, val, key) {
    val = typeof val === 'function' ? val(this) : val;
    if (val == null || !key) return;

    const addToRoot = (rootKey, value) => {
      data[rootKey] = value;
    };
    /**
     * Add the key and val to the body of the request
     */


    const addToBody = (bodyKey, value) => {
      // ignore if we already have a value
      if (data.body[bodyKey] == null) {
        data.body[bodyKey] = value;
      }
    };

    const {
      getConfig
    } = this.dependencies;

    switch (key) {
      case 'filter':
        return addToRoot('filters', (data.filters || []).concat(val));

      case 'query':
        return addToRoot(key, (data[key] || []).concat(val));

      case 'fields':
        // This will pass the passed in parameters to the new fields API.
        // Also if will only return scripted fields that are part of the specified
        // array of fields. If you specify the wildcard `*` as an array element
        // the fields API will return all fields, and all scripted fields will be returned.
        // NOTE: While the fields API supports wildcards within names, e.g. `user.*`
        //       scripted fields won't be considered for this.
        return addToBody('fields', val);

      case 'fieldsFromSource':
        // preserves legacy behavior
        const fields = [...new Set((data[key] || []).concat(val))];
        return addToRoot(key, fields);

      case 'index':
      case 'type':
      case 'highlightAll':
        return key && data[key] == null && addToRoot(key, val);

      case 'searchAfter':
        return addToBody('search_after', val);

      case 'trackTotalHits':
        return addToBody('track_total_hits', val);

      case 'source':
        return addToBody('_source', val);

      case 'sort':
        const sort = (0, _normalize_sort_request.normalizeSortRequest)(val, this.getField('index'), getConfig(_common2.UI_SETTINGS.SORT_OPTIONS));
        return addToBody(key, sort);

      default:
        return addToBody(key, val);
    }
  }
  /**
   * Walk the inheritance chain of a source and return its
   * flat representation (taking into account merging rules)
   * @returns {Promise}
   * @resolved {Object|null} - the flat data of the SearchSource
   */


  mergeProps(root = this, searchRequest = {
    body: {}
  }) {
    Object.entries(this.fields).forEach(([key, value]) => {
      this.mergeProp(searchRequest, value, key);
    });

    if (this.parent) {
      this.parent.mergeProps(root, searchRequest);
    }

    return searchRequest;
  }

  getIndexType(index) {
    if (this.searchStrategyId) {
      return this.searchStrategyId === 'default' ? undefined : this.searchStrategyId;
    } else {
      return index === null || index === void 0 ? void 0 : index.type;
    }
  }

  getFieldsWithoutSourceFilters(index, bodyFields) {
    var _sourceFilters$exclud;

    if (!index) {
      return bodyFields;
    }

    const {
      fields
    } = index;
    const sourceFilters = index.getSourceFiltering();

    if (!sourceFilters || ((_sourceFilters$exclud = sourceFilters.excludes) === null || _sourceFilters$exclud === void 0 ? void 0 : _sourceFilters$exclud.length) === 0 || bodyFields.length === 0) {
      return bodyFields;
    }

    const sourceFiltersValues = sourceFilters.excludes;
    const wildcardField = bodyFields.find(el => el === '*' || el.field === '*');
    const filter = (0, _common.fieldWildcardFilter)(sourceFiltersValues, this.dependencies.getConfig(_common2.UI_SETTINGS.META_FIELDS));

    const filterSourceFields = fieldName => fieldName && filter(fieldName);

    if (!wildcardField) {
      // we already have an explicit list of fields, so we just remove source filters from that list
      return bodyFields.filter(fld => filterSourceFields(this.getFieldName(fld)));
    } // we need to get the list of fields from an index pattern


    return fields.filter(fld => filterSourceFields(fld.name)).map(fld => ({
      field: fld.name
    }));
  }

  getFieldFromDocValueFieldsOrIndexPattern(docvaluesIndex, fld, index) {
    if (typeof fld === 'string') {
      return fld;
    }

    const fieldName = this.getFieldName(fld);
    const field = { ...docvaluesIndex[fieldName],
      ...fld
    };

    if (!index) {
      return field;
    }

    const {
      fields
    } = index;
    const dateFields = fields.getByType('date');
    const dateField = dateFields.find(indexPatternField => indexPatternField.name === fieldName);

    if (!dateField) {
      return field;
    }

    const {
      esTypes
    } = dateField;

    if (esTypes !== null && esTypes !== void 0 && esTypes.includes('date_nanos')) {
      field.format = 'strict_date_optional_time_nanos';
    } else if (esTypes !== null && esTypes !== void 0 && esTypes.includes('date')) {
      field.format = 'strict_date_optional_time';
    }

    return field;
  }

  flatten() {
    const {
      getConfig
    } = this.dependencies;
    const searchRequest = this.mergeProps();
    searchRequest.body = searchRequest.body || {};
    const {
      body,
      index,
      query,
      filters,
      highlightAll
    } = searchRequest;
    searchRequest.indexType = this.getIndexType(index); // get some special field types from the index pattern

    const {
      docvalueFields,
      scriptFields,
      storedFields,
      runtimeFields
    } = index ? index.getComputedFields() : {
      docvalueFields: [],
      scriptFields: {},
      storedFields: ['*'],
      runtimeFields: {}
    };
    const fieldListProvided = !!body.fields; // set defaults

    let fieldsFromSource = searchRequest.fieldsFromSource || [];
    body.fields = body.fields || [];
    body.script_fields = { ...body.script_fields,
      ...scriptFields
    };
    body.stored_fields = storedFields;
    body.runtime_mappings = runtimeFields || {}; // apply source filters from index pattern if specified by the user

    let filteredDocvalueFields = docvalueFields;

    if (index) {
      const sourceFilters = index.getSourceFiltering();

      if (!body.hasOwnProperty('_source')) {
        body._source = sourceFilters;
      }

      const filter = (0, _common.fieldWildcardFilter)(body._source.excludes, getConfig(_common2.UI_SETTINGS.META_FIELDS)); // also apply filters to provided fields & default docvalueFields

      body.fields = body.fields.filter(fld => filter(this.getFieldName(fld)));
      fieldsFromSource = fieldsFromSource.filter(fld => filter(this.getFieldName(fld)));
      filteredDocvalueFields = filteredDocvalueFields.filter(fld => filter(this.getFieldName(fld)));
    } // specific fields were provided, so we need to exclude any others


    if (fieldListProvided || fieldsFromSource.length) {
      const bodyFieldNames = body.fields.map(field => this.getFieldName(field));
      const uniqFieldNames = [...new Set([...bodyFieldNames, ...fieldsFromSource])];

      if (!uniqFieldNames.includes('*')) {
        // filter down script_fields to only include items specified
        body.script_fields = (0, _lodash.pick)(body.script_fields, Object.keys(body.script_fields).filter(f => uniqFieldNames.includes(f)));
        body.runtime_mappings = (0, _lodash.pick)(body.runtime_mappings, Object.keys(body.runtime_mappings).filter(f => uniqFieldNames.includes(f)));
      } // request the remaining fields from stored_fields just in case, since the
      // fields API does not handle stored fields


      const remainingFields = (0, _lodash.difference)(uniqFieldNames, [...Object.keys(body.script_fields), ...Object.keys(body.runtime_mappings)]).filter(remainingField => {
        if (!remainingField) return false;
        if (!body._source || !body._source.excludes) return true;
        return !body._source.excludes.includes(remainingField);
      });
      body.stored_fields = [...new Set(remainingFields)]; // only include unique values

      if (fieldsFromSource.length) {
        if (!(0, _lodash.isEqual)(remainingFields, fieldsFromSource)) {
          (0, _saferLodashSet.setWith)(body, '_source.includes', remainingFields, nsValue => (0, _lodash.isObject)(nsValue) ? {} : nsValue);
        } // if items that are in the docvalueFields are provided, we should
        // make sure those are added to the fields API unless they are
        // already set in docvalue_fields


        body.fields = [...body.fields, ...filteredDocvalueFields.filter(fld => {
          return fieldsFromSource.includes(this.getFieldName(fld)) && !(body.docvalue_fields || []).map(d => this.getFieldName(d)).includes(this.getFieldName(fld));
        })]; // delete fields array if it is still set to the empty default

        if (!fieldListProvided && body.fields.length === 0) delete body.fields;
      } else {
        // remove _source, since everything's coming from fields API, scripted, or stored fields
        body._source = false; // if items that are in the docvalueFields are provided, we should
        // inject the format from the computed fields if one isn't given

        const docvaluesIndex = (0, _lodash.keyBy)(filteredDocvalueFields, 'field');
        const bodyFields = this.getFieldsWithoutSourceFilters(index, body.fields);
        body.fields = (0, _lodash.uniqWith)(bodyFields.concat(filteredDocvalueFields), (fld1, fld2) => {
          const field1Name = this.getFieldName(fld1);
          const field2Name = this.getFieldName(fld2);
          return field1Name === field2Name;
        }).map(fld => {
          const fieldName = this.getFieldName(fld);

          if (Object.keys(docvaluesIndex).includes(fieldName)) {
            // either provide the field object from computed docvalues,
            // or merge the user-provided field with the one in docvalues
            return typeof fld === 'string' ? docvaluesIndex[fld] : this.getFieldFromDocValueFieldsOrIndexPattern(docvaluesIndex, fld, index);
          }

          return fld;
        });
      }
    } else {
      body.fields = filteredDocvalueFields;
    }

    const esQueryConfigs = (0, _common2.getEsQueryConfig)({
      get: getConfig
    });
    body.query = (0, _common2.buildEsQuery)(index, query, filters, esQueryConfigs);

    if (highlightAll && body.query) {
      body.highlight = (0, _field_formats.getHighlightRequest)(body.query, getConfig(_common2.UI_SETTINGS.DOC_HIGHLIGHT));
      delete searchRequest.highlightAll;
    }

    return searchRequest;
  }
  /**
   * serializes search source fields (which can later be passed to {@link ISearchStartSearchSource})
   */


  getSerializedFields(recurse = false) {
    const {
      filter: originalFilters,
      ...searchSourceFields
    } = (0, _lodash.omit)(this.getFields(recurse), ['size']);
    let serializedSearchSourceFields = { ...searchSourceFields,
      index: searchSourceFields.index ? searchSourceFields.index.id : undefined
    };

    if (originalFilters) {
      const filters = this.getFilters(originalFilters);
      serializedSearchSourceFields = { ...serializedSearchSourceFields,
        filter: filters
      };
    }

    return serializedSearchSourceFields;
  }
  /**
   * Serializes the instance to a JSON string and a set of referenced objects.
   * Use this method to get a representation of the search source which can be stored in a saved object.
   *
   * The references returned by this function can be mixed with other references in the same object,
   * however make sure there are no name-collisions. The references will be named `kibanaSavedObjectMeta.searchSourceJSON.index`
   * and `kibanaSavedObjectMeta.searchSourceJSON.filter[<number>].meta.index`.
   *
   * Using `createSearchSource`, the instance can be re-created.
   * @public */


  serialize() {
    const [searchSourceFields, references] = (0, _extract_references.extractReferences)(this.getSerializedFields());
    return {
      searchSourceJSON: JSON.stringify(searchSourceFields),
      references
    };
  }

  getFilters(filterField) {
    if (!filterField) {
      return [];
    }

    if (Array.isArray(filterField)) {
      return filterField;
    }

    if ((0, _lodash.isFunction)(filterField)) {
      return this.getFilters(filterField());
    }

    return [filterField];
  }

}

exports.SearchSource = SearchSource;