"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextField = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _hook_form_lib = require("../../hook_form_lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TextField = ({
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
    label: field.label,
    labelAppend: field.labelAppend,
    helpText: typeof field.helpText === 'function' ? field.helpText() : field.helpText,
    error: errorMessage,
    isInvalid: isInvalid,
    fullWidth: true,
    describedByIds: idAria ? [idAria] : undefined
  }, rest), /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, _extends({
    isInvalid: isInvalid,
    value: field.value,
    onChange: field.onChange,
    isLoading: field.isValidating,
    fullWidth: true,
    "data-test-subj": "input"
  }, euiFieldProps)));
};

exports.TextField = TextField;