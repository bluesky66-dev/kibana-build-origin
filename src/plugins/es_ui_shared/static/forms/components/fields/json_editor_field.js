"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonEditorField = void 0;

var _react = _interopRequireWildcard(require("react"));

var _public = require("../../../../public");

var _hook_form_lib = require("../../hook_form_lib");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const JsonEditorField = ({
  field,
  ...rest
}) => {
  const {
    errorMessage
  } = (0, _hook_form_lib.getFieldValidityAndErrorMessage)(field);
  const {
    label,
    helpText,
    value,
    setValue
  } = field;
  const onJsonUpdate = (0, _react.useCallback)(updatedJson => {
    setValue(updatedJson.data.raw);
  }, [setValue]);
  return /*#__PURE__*/_react.default.createElement(_public.JsonEditor, _extends({
    label: label,
    helpText: helpText,
    value: value,
    onUpdate: onJsonUpdate,
    error: errorMessage
  }, rest));
};

exports.JsonEditorField = JsonEditorField;