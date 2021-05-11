"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionHelp = void 0;

var _all = require("./dict/all");

var _alter_column = require("./dict/alter_column");

var _any = require("./dict/any");

var _as = require("./dict/as");

var _asset = require("./dict/asset");

var _axis_config = require("./dict/axis_config");

var _case = require("./dict/case");

var _clear = require("./dict/clear");

var _columns = require("./dict/columns");

var _compare = require("./dict/compare");

var _container_style = require("./dict/container_style");

var _context = require("./dict/context");

var _csv = require("./dict/csv");

var _date = require("./dict/date");

var _demodata = require("./dict/demodata");

var _do = require("./dict/do");

var _dropdown_control = require("./dict/dropdown_control");

var _eq = require("./dict/eq");

var _escount = require("./dict/escount");

var _esdocs = require("./dict/esdocs");

var _essql = require("./dict/essql");

var _exactly = require("./dict/exactly");

var _filterrows = require("./dict/filterrows");

var _filters = require("./dict/filters");

var _formatdate = require("./dict/formatdate");

var _formatnumber = require("./dict/formatnumber");

var _get_cell = require("./dict/get_cell");

var _gt = require("./dict/gt");

var _gte = require("./dict/gte");

var _head = require("./dict/head");

var _if = require("./dict/if");

var _image = require("./dict/image");

var _join_rows = require("./dict/join_rows");

var _location = require("./dict/location");

var _lt = require("./dict/lt");

var _lte = require("./dict/lte");

var _map_center = require("./dict/map_center");

var _map_column = require("./dict/map_column");

var _markdown = require("./dict/markdown");

var _math = require("./dict/math");

var _metric = require("./dict/metric");

var _neq = require("./dict/neq");

var _pie = require("./dict/pie");

var _plot = require("./dict/plot");

var _ply = require("./dict/ply");

var _pointseries = require("./dict/pointseries");

var _progress = require("./dict/progress");

var _render = require("./dict/render");

var _repeat_image = require("./dict/repeat_image");

var _replace = require("./dict/replace");

var _reveal_image = require("./dict/reveal_image");

var _rounddate = require("./dict/rounddate");

var _row_count = require("./dict/row_count");

var _saved_lens = require("./dict/saved_lens");

var _saved_map = require("./dict/saved_map");

var _saved_search = require("./dict/saved_search");

var _saved_visualization = require("./dict/saved_visualization");

var _series_style = require("./dict/series_style");

var _shape = require("./dict/shape");

var _sort = require("./dict/sort");

var _static_column = require("./dict/static_column");

var _string = require("./dict/string");

var _switch = require("./dict/switch");

var _table = require("./dict/table");

var _tail = require("./dict/tail");

var _timefilter = require("./dict/timefilter");

var _timefilter_control = require("./dict/timefilter_control");

var _timelion = require("./dict/timelion");

var _time_range = require("./dict/time_range");

var _to = require("./dict/to");

var _urlparam = require("./dict/urlparam");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Help text for Canvas Functions should be properly localized. This function will
 * return a dictionary of help strings, organized by `ExpressionFunctionDefinition`
 * specification and then by available arguments within each `ExpressionFunctionDefinition`.
 *
 * This a function, rather than an object, to future-proof string initialization,
 * if ever necessary.
 */


const getFunctionHelp = () => ({
  all: _all.help,
  alterColumn: _alter_column.help,
  any: _any.help,
  as: _as.help,
  asset: _asset.help,
  axisConfig: _axis_config.help,
  case: _case.help,
  clear: _clear.help,
  columns: _columns.help,
  compare: _compare.help,
  containerStyle: _container_style.help,
  context: _context.help,
  csv: _csv.help,
  date: _date.help,
  demodata: _demodata.help,
  do: _do.help,
  dropdownControl: _dropdown_control.help,
  eq: _eq.help,
  escount: _escount.help,
  esdocs: _esdocs.help,
  essql: _essql.help,
  exactly: _exactly.help,
  filterrows: _filterrows.help,
  filters: _filters.help,
  formatdate: _formatdate.help,
  formatnumber: _formatnumber.help,
  getCell: _get_cell.help,
  gt: _gt.help,
  gte: _gte.help,
  head: _head.help,
  if: _if.help,
  joinRows: _join_rows.help,
  image: _image.help,
  location: _location.help,
  lt: _lt.help,
  lte: _lte.help,
  mapCenter: _map_center.help,
  mapColumn: _map_column.help,
  markdown: _markdown.help,
  math: _math.help,
  metric: _metric.help,
  neq: _neq.help,
  pie: _pie.help,
  plot: _plot.help,
  ply: _ply.help,
  pointseries: _pointseries.help,
  progress: _progress.help,
  render: _render.help,
  repeatImage: _repeat_image.help,
  replace: _replace.help,
  revealImage: _reveal_image.help,
  rounddate: _rounddate.help,
  rowCount: _row_count.help,
  savedLens: _saved_lens.help,
  savedMap: _saved_map.help,
  // TODO: elastic/kibana#44822 Disabling pending filters work
  // @ts-ignore
  savedSearch: _saved_search.help,
  savedVisualization: _saved_visualization.help,
  seriesStyle: _series_style.help,
  shape: _shape.help,
  sort: _sort.help,
  staticColumn: _static_column.help,
  string: _string.help,
  switch: _switch.help,
  table: _table.help,
  tail: _tail.help,
  timefilter: _timefilter.help,
  timefilterControl: _timefilter_control.help,
  timelion: _timelion.help,
  timerange: _time_range.help,
  to: _to.help,
  urlparam: _urlparam.help
});

exports.getFunctionHelp = getFunctionHelp;