"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormRow = exports.FormRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _field = require("./field");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function isTitleString(title) {
  return typeof title === 'string' || title.type.name === 'FormattedMessage';
}

const FormRow = ({
  title,
  idAria,
  description,
  field,
  children,
  titleTag = 'h4',
  ...rest
}) => {
  let titleWrapped; // If a string is provided, create a default Euititle of size "m"

  if (isTitleString(title)) {
    // Create the correct title tag
    const titleWithHTag = /*#__PURE__*/_react.default.createElement(titleTag, undefined, title);

    titleWrapped = /*#__PURE__*/_react.default.createElement(_eui.EuiTitle, {
      size: "s"
    }, titleWithHTag);
  } else {
    titleWrapped = title;
  }

  return /*#__PURE__*/_react.default.createElement(_eui.EuiDescribedFormGroup, {
    title: titleWrapped,
    description: description,
    fullWidth: true
  }, children ? children : field ? /*#__PURE__*/_react.default.createElement(_field.Field, _extends({
    field: field
  }, rest)) : null);
};
/**
 * Get a <FormRow /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <FormRow /> instances
 */


exports.FormRow = FormRow;

const getFormRow = partialProps => props => {
  const componentProps = { ...partialProps,
    ...props
  };
  return /*#__PURE__*/_react.default.createElement(FormRow, componentProps);
};

exports.getFormRow = getFormRow;