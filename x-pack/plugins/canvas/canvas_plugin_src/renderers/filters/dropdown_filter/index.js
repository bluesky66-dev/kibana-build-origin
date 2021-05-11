"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownFilter = void 0;

var _common = require("@kbn/interpreter/common");

var _lodash = require("lodash");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _sync_filter_expression = require("../../../../public/lib/sync_filter_expression");

var _component = require("./component");

var _i18n = require("../../../../i18n");

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


const {
  dropdownFilter: strings
} = _i18n.RendererStrings;
const MATCH_ALL = '%%CANVAS_MATCH_ALL%%';

const getFilterValue = filterExpression => {
  if (filterExpression === '') {
    return MATCH_ALL;
  }

  const filterAST = (0, _common.fromExpression)(filterExpression);
  return (0, _lodash.get)(filterAST, 'chain[0].arguments.value[0]', MATCH_ALL);
};

const dropdownFilter = () => ({
  name: 'dropdown_filter',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,
  height: 50,

  render(domNode, config, handlers) {
    const filterExpression = handlers.getFilter();

    if (filterExpression !== '') {
      // NOTE: setFilter() will cause a data refresh, avoid calling unless required
      // compare expression and filter, update filter if needed
      const {
        changed,
        newAst
      } = (0, _sync_filter_expression.syncFilterExpression)(config, filterExpression, ['filterGroup']);

      if (changed) {
        handlers.setFilter((0, _common.toExpression)(newAst));
      }
    }

    const commit = commitValue => {
      if (commitValue === '%%CANVAS_MATCH_ALL%%') {
        handlers.setFilter('');
      } else {
        const newFilterAST = {
          type: 'expression',
          chain: [{
            type: 'function',
            function: 'exactly',
            arguments: {
              value: [commitValue],
              column: [config.column],
              filterGroup: [config.filterGroup]
            }
          }]
        };
        const newFilter = (0, _common.toExpression)(newFilterAST);
        handlers.setFilter(newFilter);
      }
    };

    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_component.DropdownFilter, {
      commit: commit,
      choices: config.choices || [],
      value: getFilterValue(filterExpression)
    }), domNode, () => handlers.done());

    handlers.onDestroy(() => {
      _reactDom.default.unmountComponentAtNode(domNode);
    });
  }

});

exports.dropdownFilter = dropdownFilter;