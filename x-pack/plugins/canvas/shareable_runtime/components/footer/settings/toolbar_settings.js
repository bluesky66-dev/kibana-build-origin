"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarSettings = exports.ToolbarSettingsComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _context = require("../../../context");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
/**
 * The settings panel for the Toolbar of a Shareable Canvas Workpad.
 */


const ToolbarSettingsComponent = ({
  isAutohide,
  onSetAutohide
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    helpText: "Hide the toolbar when the mouse is not within the Canvas?"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    "data-test-subj": "hideToolbarSwitch",
    name: "toolbarHide",
    id: "toolbarHide",
    label: "Hide Toolbar",
    checked: isAutohide,
    onChange: () => onSetAutohide(!isAutohide)
  })));
};
/**
 * A store-connected container for the `ToolbarSettings` component.
 */


exports.ToolbarSettingsComponent = ToolbarSettingsComponent;

const ToolbarSettings = ({
  onSetAutohide
}) => {
  const [{
    settings
  }, dispatch] = (0, _context.useCanvasShareableState)();
  const {
    toolbar
  } = settings;
  const {
    isAutohide
  } = toolbar;

  const onSetAutohideFn = autohide => {
    onSetAutohide(autohide);
    dispatch((0, _context.setToolbarAutohideAction)(autohide));
  };

  return /*#__PURE__*/_react.default.createElement(ToolbarSettingsComponent, _extends({
    onSetAutohide: onSetAutohideFn
  }, {
    isAutohide
  }));
};

exports.ToolbarSettings = ToolbarSettings;