"use strict";

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _extended_template = require("../extended_template");

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

const defaultExpression = {
  type: 'expression',
  chain: [{
    type: 'function',
    function: 'axisConfig',
    arguments: {}
  }]
};
const defaultValues = {
  argValue: defaultExpression
};

class Interactive extends _react2.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", defaultValues);

    _defineProperty(this, "_onValueChange", argValue => {
      (0, _addonActions.action)('onValueChange')(argValue);
      this.setState({
        argValue
      });
    });
  }

  render() {
    return /*#__PURE__*/_react2.default.createElement(_extended_template.ExtendedTemplate, {
      onValueChange: this._onValueChange,
      argValue: this.state.argValue,
      typeInstance: {
        name: 'xaxis'
      }
    });
  }

}

(0, _react.storiesOf)('arguments/AxisConfig', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('extended', () => /*#__PURE__*/_react2.default.createElement(Interactive, null));
(0, _react.storiesOf)('arguments/AxisConfig/components', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '323px',
    padding: '16px',
    background: '#fff'
  }
}, story())).add('extended disabled', () => /*#__PURE__*/_react2.default.createElement(_extended_template.ExtendedTemplate, {
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: false,
  typeInstance: {
    name: 'yaxis'
  }
})).add('extended', () => /*#__PURE__*/_react2.default.createElement(_extended_template.ExtendedTemplate, {
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: defaultExpression,
  typeInstance: {
    name: 'yaxis'
  }
}));