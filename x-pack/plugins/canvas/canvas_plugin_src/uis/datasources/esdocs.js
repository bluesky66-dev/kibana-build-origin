"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esdocs = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _arg_helpers = require("../../../public/lib/arg_helpers");

var _es_fields_select = require("../../../public/components/es_fields_select");

var _es_field_select = require("../../../public/components/es_field_select");

var _es_index_select = require("../../../public/components/es_index_select");

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
  ESDocs: strings
} = _i18n.DataSourceStrings;

const EsdocsDatasource = ({
  args,
  updateArgs,
  defaultIndex
}) => {
  const setArg = (name, value) => {
    updateArgs && updateArgs({ ...args,
      ...(0, _arg_helpers.setSimpleArg)(name, value)
    });
  }; // TODO: This is a terrible way of doing defaults. We need to find a way to read the defaults for the function
  // and set them for the data source UI.


  const getArgName = () => {
    if ((0, _arg_helpers.getSimpleArg)('_', args)[0]) {
      return '_';
    }

    if ((0, _arg_helpers.getSimpleArg)('q', args)[0]) {
      return 'q';
    }

    return 'query';
  };

  const getIndex = () => {
    return (0, _arg_helpers.getSimpleArg)('index', args)[0] || '';
  };

  const getQuery = () => {
    return (0, _arg_helpers.getSimpleArg)(getArgName(), args)[0] || '';
  };

  const getFields = () => {
    const commas = (0, _arg_helpers.getSimpleArg)('fields', args)[0] || '';

    if (commas.length === 0) {
      return [];
    }

    return commas.split(',').map(str => str.trim());
  };

  const getSortBy = () => {
    const commas = (0, _arg_helpers.getSimpleArg)('sort', args)[0] || ', DESC';
    return commas.split(',').map(str => str.trim());
  };

  const fields = getFields();
  const [sortField, sortOrder] = getSortBy();
  const index = getIndex();

  if (!index && defaultIndex) {
    setArg('index', defaultIndex);
  }

  const sortOptions = [{
    value: 'asc',
    text: strings.getAscendingOption()
  }, {
    value: 'desc',
    text: strings.getDescendingOption()
  }];
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getIndexTitle(),
    helpText: strings.getIndexLabel(),
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_es_index_select.ESIndexSelect, {
    value: index,
    onChange: index => setArg('index', index)
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getFieldsTitle(),
    helpText: fields.length <= 10 ? strings.getFieldsLabel() : strings.getFieldsWarningLabel(),
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_es_fields_select.ESFieldsSelect, {
    index: index,
    onChange: fields => setArg('fields', fields.join(', ')),
    selected: fields
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiAccordion, {
    id: "accordionAdvancedSettings",
    buttonContent: "Advanced settings",
    className: "canvasSidebar__accordion"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getSortFieldTitle(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_es_field_select.ESFieldSelect, {
    index: index,
    value: sortField,
    onChange: field => setArg('sort', [field, sortOrder].join(', '))
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getSortOrderTitle(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    value: sortOrder.toLowerCase(),
    onChange: e => setArg('sort', [sortField, e.target.value].join(', ')),
    options: sortOptions,
    compressed: true
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getQueryTitle(),
    labelAppend: /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
      size: "xs"
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiLink, {
      href: _i18n.LUCENE_QUERY_URL,
      target: "_blank"
    }, strings.getQueryLabel())),
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiTextArea, {
    value: getQuery(),
    onChange: e => setArg(getArgName(), e.target.value),
    compressed: true
  }))), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "m"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiCallOut, {
    size: "s",
    title: strings.getWarningTitle(),
    iconType: "alert",
    color: "warning"
  }, /*#__PURE__*/_react.default.createElement("p", null, strings.getWarning())));
};

EsdocsDatasource.propTypes = {
  args: _propTypes.default.object.isRequired,
  updateArgs: _propTypes.default.func,
  defaultIndex: _propTypes.default.string
};

const esdocs = () => ({
  name: 'esdocs',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  image: 'documents',
  template: (0, _template_from_react_component.templateFromReactComponent)(EsdocsDatasource)
});

exports.esdocs = esdocs;