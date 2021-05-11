"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visPayloadSchema = exports.panel = exports.seriesItems = exports.metricsItems = exports.fieldObject = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stringOptionalNullable = _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string()));

const stringRequired = _configSchema.schema.string();

const arrayNullable = _configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.any()));

const validateInteger = value => {
  if (!Number.isInteger(value)) {
    return `${value} is not an integer`;
  }
};

const numberIntegerOptional = _configSchema.schema.maybe(_configSchema.schema.number({
  validate: validateInteger
}));

const numberIntegerRequired = _configSchema.schema.number({
  validate: validateInteger
});

const numberOptional = _configSchema.schema.maybe(_configSchema.schema.number());

const queryObject = _configSchema.schema.object({
  language: _configSchema.schema.string(),
  query: _configSchema.schema.string()
});

const stringOrNumberOptionalNullable = _configSchema.schema.nullable(_configSchema.schema.oneOf([stringOptionalNullable, numberOptional]));

const numberOptionalOrEmptyString = _configSchema.schema.maybe(_configSchema.schema.oneOf([numberOptional, _configSchema.schema.literal('')]));

const fieldObject = stringOptionalNullable;
exports.fieldObject = fieldObject;

const annotationsItems = _configSchema.schema.object({
  color: stringOptionalNullable,
  fields: stringOptionalNullable,
  hidden: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  icon: stringOptionalNullable,
  id: stringOptionalNullable,
  ignore_global_filters: numberIntegerOptional,
  ignore_panel_filters: numberIntegerOptional,
  index_pattern: stringOptionalNullable,
  query_string: _configSchema.schema.maybe(queryObject),
  template: stringOptionalNullable,
  time_field: fieldObject
});

const backgroundColorRulesItems = _configSchema.schema.object({
  value: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number())),
  id: stringOptionalNullable,
  background_color: stringOptionalNullable,
  color: stringOptionalNullable,
  operator: stringOptionalNullable
});

const gaugeColorRulesItems = _configSchema.schema.object({
  gauge: stringOptionalNullable,
  text: stringOptionalNullable,
  id: stringOptionalNullable,
  operator: stringOptionalNullable,
  value: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number()))
});

const metricsItems = _configSchema.schema.object({
  field: fieldObject,
  id: stringRequired,
  alias: stringOptionalNullable,
  metric_agg: stringOptionalNullable,
  numerator: _configSchema.schema.maybe(queryObject),
  denominator: _configSchema.schema.maybe(queryObject),
  sigma: stringOptionalNullable,
  unit: stringOptionalNullable,
  model_type: stringOptionalNullable,
  mode: stringOptionalNullable,
  lag: numberOptionalOrEmptyString,
  alpha: numberOptional,
  beta: numberOptional,
  gamma: numberOptional,
  period: numberOptional,
  multiplicative: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  window: numberOptional,
  function: stringOptionalNullable,
  script: stringOptionalNullable,
  variables: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    field: fieldObject,
    id: stringRequired,
    name: stringOptionalNullable
  }))),
  numberOfSignificantValueDigits: numberOptional,
  percentiles: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    id: stringRequired,
    field: fieldObject,
    mode: _configSchema.schema.oneOf([_configSchema.schema.literal('line'), _configSchema.schema.literal('band')]),
    shade: _configSchema.schema.oneOf([numberOptional, stringOptionalNullable]),
    value: _configSchema.schema.maybe(_configSchema.schema.oneOf([numberOptional, stringOptionalNullable])),
    percentile: stringOptionalNullable
  }))),
  type: stringRequired,
  value: stringOptionalNullable,
  values: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.string())))),
  size: stringOrNumberOptionalNullable,
  agg_with: stringOptionalNullable,
  order: stringOptionalNullable,
  order_by: fieldObject
});

exports.metricsItems = metricsItems;

const splitFiltersItems = _configSchema.schema.object({
  id: stringOptionalNullable,
  color: stringOptionalNullable,
  filter: _configSchema.schema.maybe(queryObject),
  label: stringOptionalNullable
});

const seriesItems = _configSchema.schema.object({
  aggregate_by: fieldObject,
  aggregate_function: stringOptionalNullable,
  axis_position: stringRequired,
  axis_max: stringOrNumberOptionalNullable,
  axis_min: stringOrNumberOptionalNullable,
  chart_type: stringRequired,
  color: stringRequired,
  color_rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    value: numberOptional,
    id: stringRequired,
    text: stringOptionalNullable,
    operator: stringOptionalNullable
  }))),
  fill: numberOptionalOrEmptyString,
  filter: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.object({
    query: stringRequired,
    language: stringOptionalNullable
  }), _configSchema.schema.literal('')])),
  formatter: stringRequired,
  hide_in_legend: numberIntegerOptional,
  hidden: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  id: stringRequired,
  ignore_global_filter: numberOptional,
  label: stringOptionalNullable,
  line_width: numberOptionalOrEmptyString,
  metrics: _configSchema.schema.arrayOf(metricsItems),
  offset_time: stringOptionalNullable,
  override_index_pattern: numberOptional,
  point_size: numberOptionalOrEmptyString,
  separate_axis: numberIntegerOptional,
  seperate_axis: numberIntegerOptional,
  series_index_pattern: stringOptionalNullable,
  series_max_bars: numberIntegerOptional,
  series_time_field: fieldObject,
  series_interval: stringOptionalNullable,
  series_drop_last_bucket: numberIntegerOptional,
  split_color_mode: stringOptionalNullable,
  split_filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(splitFiltersItems)),
  split_mode: stringRequired,
  stacked: stringRequired,
  steps: numberIntegerOptional,
  terms_field: fieldObject,
  terms_order_by: stringOptionalNullable,
  terms_size: stringOptionalNullable,
  terms_direction: stringOptionalNullable,
  terms_include: stringOptionalNullable,
  terms_exclude: stringOptionalNullable,
  time_range_mode: stringOptionalNullable,
  trend_arrows: numberOptional,
  type: stringOptionalNullable,
  value_template: stringOptionalNullable,
  var_name: stringOptionalNullable
});

exports.seriesItems = seriesItems;

const panel = _configSchema.schema.object({
  annotations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(annotationsItems)),
  axis_formatter: stringRequired,
  axis_position: stringRequired,
  axis_scale: stringRequired,
  axis_min: stringOrNumberOptionalNullable,
  axis_max: stringOrNumberOptionalNullable,
  bar_color_rules: _configSchema.schema.maybe(arrayNullable),
  background_color: stringOptionalNullable,
  background_color_rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(backgroundColorRulesItems)),
  default_index_pattern: stringOptionalNullable,
  default_timefield: stringOptionalNullable,
  drilldown_url: stringOptionalNullable,
  drop_last_bucket: numberIntegerOptional,
  filter: _configSchema.schema.nullable(_configSchema.schema.oneOf([stringOptionalNullable, _configSchema.schema.object({
    language: stringOptionalNullable,
    query: stringOptionalNullable
  })])),
  gauge_color_rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(gaugeColorRulesItems)),
  gauge_width: _configSchema.schema.nullable(_configSchema.schema.oneOf([stringOptionalNullable, numberOptional])),
  gauge_inner_color: stringOptionalNullable,
  gauge_inner_width: stringOrNumberOptionalNullable,
  gauge_style: stringOptionalNullable,
  gauge_max: stringOrNumberOptionalNullable,
  id: stringRequired,
  ignore_global_filters: numberOptional,
  ignore_global_filter: numberOptional,
  index_pattern: stringRequired,
  max_bars: numberIntegerOptional,
  interval: stringRequired,
  isModelInvalid: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  legend_position: stringOptionalNullable,
  markdown: stringOptionalNullable,
  markdown_scrollbars: numberIntegerOptional,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  markdown_openLinksInNewTab: numberIntegerOptional,
  markdown_vertical_align: stringOptionalNullable,
  markdown_less: stringOptionalNullable,
  markdown_css: stringOptionalNullable,
  pivot_id: fieldObject,
  pivot_label: stringOptionalNullable,
  pivot_type: stringOptionalNullable,
  pivot_rows: stringOptionalNullable,
  series: _configSchema.schema.arrayOf(seriesItems),
  show_grid: numberIntegerRequired,
  show_legend: numberIntegerRequired,
  tooltip_mode: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('show_all'), _configSchema.schema.literal('show_focused')])),
  time_field: fieldObject,
  time_range_mode: stringOptionalNullable,
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('table'), _configSchema.schema.literal('gauge'), _configSchema.schema.literal('markdown'), _configSchema.schema.literal('top_n'), _configSchema.schema.literal('timeseries'), _configSchema.schema.literal('metric')])
});

exports.panel = panel;

const visPayloadSchema = _configSchema.schema.object({
  filters: arrayNullable,
  panels: _configSchema.schema.arrayOf(panel),
  // general
  query: _configSchema.schema.nullable(_configSchema.schema.arrayOf(queryObject)),
  state: _configSchema.schema.object({
    sort: _configSchema.schema.maybe(_configSchema.schema.object({
      column: stringRequired,
      order: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')])
    }))
  }),
  timerange: _configSchema.schema.object({
    timezone: stringRequired,
    min: stringRequired,
    max: stringRequired
  }),
  searchSession: _configSchema.schema.maybe(_configSchema.schema.object({
    sessionId: _configSchema.schema.string(),
    isRestore: _configSchema.schema.boolean({
      defaultValue: false
    }),
    isStored: _configSchema.schema.boolean({
      defaultValue: false
    })
  }))
});

exports.visPayloadSchema = visPayloadSchema;