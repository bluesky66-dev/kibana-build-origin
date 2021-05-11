"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _context_example = require("../../../test/context_example");

var _page_controls = require("../page_controls");

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

const style = {
  background: '#333',
  padding: 10
};
(0, _react2.storiesOf)('shareables/Footer/PageControls', module).add('contextual: hello', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, _extends({
  source: "austin"
}, {
  style
}), /*#__PURE__*/_react.default.createElement(_page_controls.PageControls, null))).add('contextual: austin', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, _extends({
  source: "austin"
}, {
  style
}), /*#__PURE__*/_react.default.createElement(_page_controls.PageControls, null))).add('component', () => /*#__PURE__*/_react.default.createElement("div", {
  style
}, /*#__PURE__*/_react.default.createElement(_page_controls.PageControlsComponent, {
  page: 0,
  totalPages: 10,
  onSetPageNumber: (0, _addonActions.action)('onSetPageNumber'),
  onToggleScrubber: (0, _addonActions.action)('onToggleScrubber')
})));