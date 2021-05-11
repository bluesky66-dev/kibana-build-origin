"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelion = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _react2 = require("@kbn/i18n/react");

var _arg_helpers = require("../../../public/lib/arg_helpers");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _i18n = require("../../../i18n");

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
  Timelion: strings
} = _i18n.DataSourceStrings;

const TimelionDatasource = ({
  args,
  updateArgs,
  defaultIndex
}) => {
  const DEFAULT_QUERY = `.es(index=${defaultIndex})`;

  const setArg = (name, value) => {
    updateArgs && updateArgs({ ...args,
      ...(0, _arg_helpers.setSimpleArg)(name, value)
    });
  };

  const getArgName = () => {
    if ((0, _arg_helpers.getSimpleArg)('_', args)[0]) {
      return '_';
    }

    if ((0, _arg_helpers.getSimpleArg)('q', args)[0]) {
      return 'q';
    }

    return 'query';
  };

  const argName = getArgName(); // TODO: This is a terrible way of doing defaults. We need to find a way to read the defaults for the function
  // and set them for the data source UI.

  const getQuery = () => {
    return (0, _arg_helpers.getSimpleArg)(argName, args)[0] || DEFAULT_QUERY;
  };

  const getInterval = () => {
    return (0, _arg_helpers.getSimpleArg)('interval', args)[0] || 'auto';
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_eui.EuiCallOut, {
    title: strings.getTipsHeading(),
    size: "s",
    iconType: "iInCircle"
  }, /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
    id: "xpack.canvas.uis.dataSources.timelion.tips.time",
    defaultMessage: "{timelion} requires a time range. Add a time filter element to your page or use the expression editor to pass one in.",
    values: {
      timelion: _i18n.TIMELION
    }
  })), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
    id: "xpack.canvas.uis.dataSources.timelion.tips.functions",
    defaultMessage: "Some {timelion} functions, such as {functionExample}, do not translate to a {canvas} data table. However, anything todo with data manipulation should work as expected.",
    values: {
      timelion: _i18n.TIMELION,
      canvas: _i18n.CANVAS,
      functionExample: /*#__PURE__*/_react.default.createElement(_eui.EuiCode, null, ".color()")
    }
  })))), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "m"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getQueryLabel(),
    labelAppend: /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
      size: "xs"
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiLink, {
      href: _i18n.TIMELION_QUERY_URL,
      target: "_blank"
    }, strings.queryLabel())),
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiTextArea, {
    className: "canvasTextArea__code",
    value: getQuery(),
    onChange: e => setArg(argName, e.target.value),
    rows: 15
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getIntervalLabel(),
    helpText: strings.getIntervalHelp(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, {
    compressed: true,
    value: getInterval(),
    onChange: e => setArg('interval', e.target.value)
  })));
};

TimelionDatasource.propTypes = {
  args: _propTypes.default.object.isRequired,
  updateArgs: _propTypes.default.func,
  defaultIndex: _propTypes.default.string
};

const timelion = () => ({
  name: 'timelion',
  displayName: _i18n.TIMELION,
  help: strings.getHelp(),
  image: 'visTimelion',
  template: (0, _template_from_react_component.templateFromReactComponent)(TimelionDatasource)
});

exports.timelion = timelion;