"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "reduxDecorator", {
  enumerable: true,
  get: function () {
    return _redux_decorator.reduxDecorator;
  }
});
exports.addDecorators = void 0;

var _react = require("@storybook/react");

var _router_decorator = require("./router_decorator");

var _kibana_decorator = require("./kibana_decorator");

var _services_decorator = require("./services_decorator");

var _redux_decorator = require("./redux_decorator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addDecorators = () => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('babel-plugin-require-context-hook/register')();
  }

  (0, _react.addDecorator)(_kibana_decorator.kibanaContextDecorator);
  (0, _react.addDecorator)(_router_decorator.routerContextDecorator);
  (0, _react.addDecorator)(_services_decorator.servicesContextDecorator);
};

exports.addDecorators = addDecorators;