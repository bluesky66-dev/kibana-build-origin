"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ADDON_ID", {
  enumerable: true,
  get: function () {
    return _constants.ADDON_ID;
  }
});
Object.defineProperty(exports, "ACTIONS_PANEL_ID", {
  enumerable: true,
  get: function () {
    return _constants.ACTIONS_PANEL_ID;
  }
});
exports.reduxDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _lodash = require("lodash");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _elements_registry = require("../../public/lib/elements_registry");

var _image = require("../../canvas_plugin_src/elements/image");

var _state = require("../addon/src/state");

var _constants = require("../addon/src/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* es-lint-disable import/no-extraneous-dependencies */
// @ts-expect-error untyped local


_elements_registry.elementsRegistry.register(_image.image);

const reduxDecorator = (params = {}) => {
  const state = (0, _lodash.cloneDeep)((0, _state.getInitialState)());
  const {
    workpad,
    elements,
    assets
  } = params;

  if (workpad) {
    (0, _saferLodashSet.set)(state, 'persistent.workpad', workpad);
  }

  if (elements) {
    (0, _saferLodashSet.set)(state, 'persistent.workpad.pages.0.elements', elements);
  }

  if (assets) {
    (0, _saferLodashSet.set)(state, 'assets', assets.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {}));
  }

  return story => {
    const store = (0, _redux.createStore)((0, _state.getReducer)(), state, (0, _state.getMiddleware)());
    store.dispatch = (0, _state.patchDispatch)(store, store.dispatch);
    return /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
      store: store
    }, story());
  };
};

exports.reduxDecorator = reduxDecorator;