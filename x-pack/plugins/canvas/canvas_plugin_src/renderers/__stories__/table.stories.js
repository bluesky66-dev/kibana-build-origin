"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _table = require("../table");

var _render = require("./render");

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


(0, _react2.storiesOf)('renderers/table', module).add('default', () => {
  const config = {
    paginate: true,
    perPage: 5,
    showHeader: true,
    datatable: {
      type: 'datatable',
      columns: [{
        name: 'Foo',
        type: 'string',
        id: 'id-foo',
        meta: {
          type: 'string'
        }
      }, {
        name: 'Bar',
        type: 'number',
        id: 'id-bar',
        meta: {
          type: 'string'
        }
      }],
      rows: [{
        Foo: 'a',
        Bar: 700
      }, {
        Foo: 'b',
        Bar: 600
      }, {
        Foo: 'c',
        Bar: 500
      }, {
        Foo: 'd',
        Bar: 400
      }, {
        Foo: 'e',
        Bar: 300
      }, {
        Foo: 'f',
        Bar: 200
      }, {
        Foo: 'g',
        Bar: 100
      }]
    }
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _table.table,
    config: config,
    width: "400px"
  });
});