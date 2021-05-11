"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckBoxField = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _uuid = _interopRequireDefault(require("uuid"));

var _hook_form_lib = require("../../hook_form_lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const CheckBoxField = ({
  field,
  euiFieldProps = {},
  idAria,
  ...rest
}) => {
  const {
    isInvalid,
    errorMessage
  } = (0, _hook_form_lib.getFieldValidityAndErrorMessage)(field);
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, _extends({
    helpText: typeof field.helpText === 'function' ? field.helpText() : field.helpText,
    error: errorMessage,
    isInvalid: isInvalid,
    fullWidth: true,
    describedByIds: idAria ? [idAria] : undefined
  }, rest), /*#__PURE__*/_react.default.createElement(_eui.EuiCheckbox, _extends({
    label: field.label,
    checked: field.value,
    onChange: field.onChange,
    id: euiFieldProps.id || (0, _uuid.default)(),
    "data-test-subj": "input"
  }, euiFieldProps)));
};

exports.CheckBoxField = CheckBoxField;