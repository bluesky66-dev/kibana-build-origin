"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Render = exports.defaultHandlers = void 0;

var _addonActions = require("@storybook/addon-actions");

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultHandlers = {
  destroy: () => (0, _addonActions.action)('destroy'),
  getElementId: () => 'element-id',
  getFilter: () => 'filter',
  getRenderMode: () => 'display',
  isSyncColorsEnabled: () => false,
  onComplete: fn => undefined,
  onEmbeddableDestroyed: (0, _addonActions.action)('onEmbeddableDestroyed'),
  onEmbeddableInputChange: (0, _addonActions.action)('onEmbeddableInputChange'),
  onResize: (0, _addonActions.action)('onResize'),
  resize: (0, _addonActions.action)('resize'),
  setFilter: (0, _addonActions.action)('setFilter'),
  done: (0, _addonActions.action)('done'),
  onDestroy: (0, _addonActions.action)('onDestroy'),
  reload: (0, _addonActions.action)('reload'),
  update: (0, _addonActions.action)('update'),
  event: (0, _addonActions.action)('event')
};
/*
  Uses a RenderDefinitionFactory and Config to render into an element.

  Intended to be used for stories for RenderDefinitionFactory
*/

exports.defaultHandlers = defaultHandlers;

const Render = ({
  renderer,
  config,
  ...rest
}) => {
  const {
    height,
    width,
    handlers
  } = {
    height: '200px',
    width: '200px',
    handlers: defaultHandlers,
    ...rest
  };
  const containerRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (renderer && containerRef.current !== null) {
      renderer().render(containerRef.current, config, handlers);
    }
  }, [renderer, config, handlers]);
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width,
      height
    },
    ref: containerRef
  }, ' ');
};

exports.Render = Render;