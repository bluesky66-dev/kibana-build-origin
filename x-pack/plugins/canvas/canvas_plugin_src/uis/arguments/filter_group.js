"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterGroup = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _i18n = require("../../../i18n");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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


const {
  FilterGroup: strings
} = _i18n.ArgumentStrings;

const FilterGroupInput = ({
  onValueChange,
  argValue,
  argId,
  filterGroups
}) => {
  const [inputValue, setInputValue] = (0, _react.useState)('');
  const [addMode, setAddMode] = (0, _react.useState)(false); // make sure the argValue is always included in the filter group list

  const argValueChoice = argValue && !filterGroups.includes(argValue) ? [{
    text: argValue
  }] : [];
  const choices = [{
    text: 'No group',
    value: ''
  }].concat(argValueChoice, filterGroups.map(f => ({
    text: f
  })));

  const handleSelectGroup = ev => {
    const selected = ev.target.value;
    onValueChange(selected);
  };

  const handleAddGroup = ev => {
    // stop the form from submitting
    ev.preventDefault(); // set the new value

    onValueChange(inputValue); // reset the component and input value

    setAddMode(false);
    setInputValue('');
  };

  const addForm = /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleAddGroup
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    gutterSize: "s"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, {
    autoFocus: true,
    compressed: true,
    type: "text",
    value: inputValue,
    onChange: ev => setInputValue(ev.target.value)
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false,
    className: "canvasSidebar__panel-noMinWidth"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    type: "submit",
    size: "s",
    onClick: handleAddGroup
  }, strings.getButtonSet()))), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiButtonEmpty, {
    color: "danger",
    size: "xs",
    onClick: () => setAddMode(!addMode),
    flush: "left"
  }, strings.getButtonCancel()));

  const selectForm = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    id: argId,
    value: argValue || '',
    options: choices,
    onChange: handleSelectGroup
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiButtonEmpty, {
    size: "xs",
    onClick: () => setAddMode(!addMode),
    flush: "left"
  }, strings.getCreateNewGroup()));

  return addMode ? addForm : selectForm;
};

FilterGroupInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]).isRequired,
  typeInstance: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired
  }),
  argId: _propTypes.default.string.isRequired
};

const filterGroup = () => ({
  name: 'filterGroup',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(FilterGroupInput)
});

exports.filterGroup = filterGroup;