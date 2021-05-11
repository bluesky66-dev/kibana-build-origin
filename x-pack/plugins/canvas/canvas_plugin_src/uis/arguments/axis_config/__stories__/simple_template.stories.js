"use strict";

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _simple_template = require("../simple_template");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const defaultValues = {
  argValue: false
};

class Interactive extends _react2.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", defaultValues);
  }

  render() {
    return /*#__PURE__*/_react2.default.createElement(_simple_template.SimpleTemplate, {
      onValueChange: argValue => {
        (0, _addonActions.action)('onValueChange')(argValue);
        this.setState({
          argValue
        });
      },
      argValue: this.state.argValue
    });
  }

}

(0, _react.storiesOf)('arguments/AxisConfig', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('simple', () => /*#__PURE__*/_react2.default.createElement(Interactive, null));
(0, _react.storiesOf)('arguments/AxisConfig/components', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('simple template', () => /*#__PURE__*/_react2.default.createElement(_simple_template.SimpleTemplate, {
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: false
}));