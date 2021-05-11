"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabbedAggResponseWriter = void 0;

var _lodash = require("lodash");

var _get_columns = require("./get_columns");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Writer class that collects information about an aggregation response and
 * produces a table, or a series of tables.
 */
class TabbedAggResponseWriter {
  /**
   * @param {AggConfigs} aggs - the agg configs object to which the aggregation response correlates
   * @param {boolean} metricsAtAllLevels - setting to true will produce metrics for every bucket
   * @param {boolean} partialRows - setting to true will not remove rows with missing values
   */
  constructor(aggs, params) {
    _defineProperty(this, "columns", void 0);

    _defineProperty(this, "rows", []);

    _defineProperty(this, "bucketBuffer", []);

    _defineProperty(this, "metricBuffer", []);

    _defineProperty(this, "partialRows", void 0);

    _defineProperty(this, "params", void 0);

    this.partialRows = params.partialRows || false;
    this.params = params;
    this.columns = (0, _get_columns.tabifyGetColumns)(aggs.getResponseAggs(), !params.metricsAtAllLevels);
    this.rows = [];
  }
  /**
   * Create a new row by reading the row buffer and bucketBuffer
   */


  row() {
    const rowBuffer = {};
    this.bucketBuffer.forEach(bucket => {
      rowBuffer[bucket.id] = bucket.value;
    });
    this.metricBuffer.forEach(metric => {
      rowBuffer[metric.id] = metric.value;
    });
    const isPartialRow = !this.columns.every(column => rowBuffer.hasOwnProperty(column.id));
    const removePartial = isPartialRow && !this.partialRows;

    if (!(0, _lodash.isEmpty)(rowBuffer) && !removePartial) {
      this.rows.push(rowBuffer);
    }
  }

  response() {
    return {
      type: 'datatable',
      columns: this.columns.map(column => {
        var _column$aggConfig$par, _column$aggConfig$par2, _column$aggConfig$get, _column$aggConfig$get2, _column$aggConfig$par3, _column$aggConfig$par4, _this$params$timeRang, _this$params$timeRang2, _this$params$timeRang3, _this$params$timeRang4;

        const cleanedColumn = {
          id: column.id,
          name: column.name,
          meta: {
            type: column.aggConfig.type.valueType || ((_column$aggConfig$par = column.aggConfig.params.field) === null || _column$aggConfig$par === void 0 ? void 0 : _column$aggConfig$par.type) || 'number',
            field: (_column$aggConfig$par2 = column.aggConfig.params.field) === null || _column$aggConfig$par2 === void 0 ? void 0 : _column$aggConfig$par2.name,
            index: (_column$aggConfig$get = column.aggConfig.getIndexPattern()) === null || _column$aggConfig$get === void 0 ? void 0 : _column$aggConfig$get.title,
            params: column.aggConfig.toSerializedFieldFormat(),
            source: 'esaggs',
            sourceParams: {
              indexPatternId: (_column$aggConfig$get2 = column.aggConfig.getIndexPattern()) === null || _column$aggConfig$get2 === void 0 ? void 0 : _column$aggConfig$get2.id,
              appliedTimeRange: (_column$aggConfig$par3 = column.aggConfig.params.field) !== null && _column$aggConfig$par3 !== void 0 && _column$aggConfig$par3.name && this.params.timeRange && this.params.timeRange.timeFields && this.params.timeRange.timeFields.includes((_column$aggConfig$par4 = column.aggConfig.params.field) === null || _column$aggConfig$par4 === void 0 ? void 0 : _column$aggConfig$par4.name) ? {
                from: (_this$params$timeRang = this.params.timeRange) === null || _this$params$timeRang === void 0 ? void 0 : (_this$params$timeRang2 = _this$params$timeRang.from) === null || _this$params$timeRang2 === void 0 ? void 0 : _this$params$timeRang2.toISOString(),
                to: (_this$params$timeRang3 = this.params.timeRange) === null || _this$params$timeRang3 === void 0 ? void 0 : (_this$params$timeRang4 = _this$params$timeRang3.to) === null || _this$params$timeRang4 === void 0 ? void 0 : _this$params$timeRang4.toISOString()
              } : undefined,
              ...column.aggConfig.serialize()
            }
          }
        };
        return cleanedColumn;
      }),
      rows: this.rows
    };
  }

}

exports.TabbedAggResponseWriter = TabbedAggResponseWriter;