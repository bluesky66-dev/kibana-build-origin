"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibana = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const toArray = query => !query ? [] : Array.isArray(query) ? query : [query];

const kibana = {
  name: 'kibana',
  type: 'kibana_context',
  inputTypes: ['kibana_context', 'null'],
  help: _i18n.i18n.translate('data.search.functions.kibana.help', {
    defaultMessage: 'Gets kibana global context'
  }),
  args: {},

  fn(input, _, {
    getSearchContext
  }) {
    const output = { // TODO: This spread is left here for legacy reasons, possibly Lens uses it.
      // TODO: But it shouldn't be need.
      ...input,
      type: 'kibana_context',
      query: [...toArray(getSearchContext().query), ...toArray((input || {}).query)],
      filters: [...(getSearchContext().filters || []), ...((input || {}).filters || [])],
      timeRange: getSearchContext().timeRange || (input ? input.timeRange : undefined)
    };
    return output;
  }

};
exports.kibana = kibana;