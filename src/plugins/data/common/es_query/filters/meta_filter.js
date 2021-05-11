"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFilters = exports.isFilter = exports.unpinFilter = exports.pinFilter = exports.disableFilter = exports.enableFilter = exports.toggleFilterPinned = exports.toggleFilterNegated = exports.toggleFilterDisabled = exports.isFilterPinned = exports.buildEmptyFilter = exports.FilterStateStore = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let FilterStateStore; // eslint-disable-next-line

exports.FilterStateStore = FilterStateStore;

(function (FilterStateStore) {
  FilterStateStore["APP_STATE"] = "appState";
  FilterStateStore["GLOBAL_STATE"] = "globalState";
})(FilterStateStore || (exports.FilterStateStore = FilterStateStore = {}));

const buildEmptyFilter = (isPinned, index) => {
  const meta = {
    disabled: false,
    negate: false,
    alias: null,
    index
  };
  const $state = {
    store: isPinned ? FilterStateStore.GLOBAL_STATE : FilterStateStore.APP_STATE
  };
  return {
    meta,
    $state
  };
};

exports.buildEmptyFilter = buildEmptyFilter;

const isFilterPinned = filter => {
  return filter.$state && filter.$state.store === FilterStateStore.GLOBAL_STATE;
};

exports.isFilterPinned = isFilterPinned;

const toggleFilterDisabled = filter => {
  const disabled = !filter.meta.disabled;
  const meta = { ...filter.meta,
    disabled
  };
  return { ...filter,
    meta
  };
};

exports.toggleFilterDisabled = toggleFilterDisabled;

const toggleFilterNegated = filter => {
  const negate = !filter.meta.negate;
  const meta = { ...filter.meta,
    negate
  };
  return { ...filter,
    meta
  };
};

exports.toggleFilterNegated = toggleFilterNegated;

const toggleFilterPinned = filter => {
  const store = isFilterPinned(filter) ? FilterStateStore.APP_STATE : FilterStateStore.GLOBAL_STATE;
  const $state = { ...filter.$state,
    store
  };
  return { ...filter,
    $state
  };
};

exports.toggleFilterPinned = toggleFilterPinned;

const enableFilter = filter => !filter.meta.disabled ? filter : toggleFilterDisabled(filter);

exports.enableFilter = enableFilter;

const disableFilter = filter => filter.meta.disabled ? filter : toggleFilterDisabled(filter);

exports.disableFilter = disableFilter;

const pinFilter = filter => isFilterPinned(filter) ? filter : toggleFilterPinned(filter);

exports.pinFilter = pinFilter;

const unpinFilter = filter => !isFilterPinned(filter) ? filter : toggleFilterPinned(filter);

exports.unpinFilter = unpinFilter;

const isFilter = x => !!x && typeof x === 'object' && !!x.meta && typeof x.meta === 'object' && typeof x.meta.disabled === 'boolean';

exports.isFilter = isFilter;

const isFilters = x => Array.isArray(x) && !x.find(y => !isFilter(y));

exports.isFilters = isFilters;