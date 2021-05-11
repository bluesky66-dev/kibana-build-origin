"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datacolumn = void 0;

var _react = _interopRequireWildcard(require("react"));

var _recompose = require("recompose");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _lodash = require("lodash");

var _common = require("@kbn/interpreter/common");

var _stateful_prop = require("../../../../public/components/enhance/stateful_prop");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _i18n = require("../../../../i18n");

var _simple_math_function = require("./simple_math_function");

var _get_form_object = require("./get_form_object");

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

const {
  DataColumn: strings
} = _i18n.ArgumentStrings;

const maybeQuoteValue = val => val.match(/\s/) ? `'${val}'` : val; // TODO: Garbage, we could make a much nicer math form that can handle way more.


class DatacolumnArgInput extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "inputRefs", {});
  }

  render() {
    const {
      onValueChange,
      columns,
      mathValue,
      setMathFunction,
      renderError,
      argId,
      typeInstance
    } = this.props;

    if (mathValue.error) {
      renderError();
      return null;
    }

    const allowedTypes = typeInstance.options.allowedTypes || false;
    const onlyShowMathFunctions = typeInstance.options.onlyMath || false;

    const valueNotSet = val => !val || val.length === 0;

    const updateFunctionValue = () => {
      const fn = this.inputRefs.fn.value;
      const column = this.inputRefs.column.value; // if setting size, auto-select the first column if no column is already set

      if (fn === 'size') {
        const col = column || columns[0] && columns[0].name;

        if (col) {
          return onValueChange(`${fn}(${maybeQuoteValue(col)})`);
        }
      } // this.inputRefs.column is the column selection, if there is no value, do nothing


      if (valueNotSet(column)) {
        return setMathFunction(fn);
      } // this.inputRefs.fn is the math function to use, if it's not set, just use the value input


      if (valueNotSet(fn)) {
        return onValueChange(column);
      } // this.inputRefs.fn has a value, so use it as a math.js expression


      onValueChange(`${fn}(${maybeQuoteValue(column)})`);
    };

    const column = columns.map(col => col.name).find(colName => colName === mathValue.column) || '';
    const options = [{
      value: '',
      text: 'select column',
      disabled: true
    }];
    (0, _lodash.sortBy)(columns, 'name').forEach(column => {
      if (allowedTypes && !allowedTypes.includes(column.type)) {
        return;
      }

      options.push({
        value: column.name,
        text: column.name
      });
    });
    return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
      gutterSize: "s",
      id: argId,
      direction: "row"
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
      grow: false
    }, /*#__PURE__*/_react.default.createElement(_simple_math_function.SimpleMathFunction, {
      id: argId,
      value: mathValue.fn,
      inputRef: ref => this.inputRefs.fn = ref,
      onlymath: onlyShowMathFunctions,
      onChange: updateFunctionValue
    })), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
      compressed: true,
      options: options,
      value: column,
      inputRef: ref => this.inputRefs.column = ref,
      onChange: updateFunctionValue
    })));
  }

}

_defineProperty(DatacolumnArgInput, "propTypes", {
  columns: _propTypes.default.array.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  mathValue: _propTypes.default.object.isRequired,
  setMathFunction: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired,
  renderError: _propTypes.default.func.isRequired,
  argId: _propTypes.default.string.isRequired
});

const EnhancedDatacolumnArgInput = (0, _recompose.compose)((0, _recompose.withPropsOnChange)(['argValue', 'columns'], ({
  argValue,
  columns
}) => ({
  mathValue: (argValue => {
    if ((0, _common.getType)(argValue) !== 'string') {
      return {
        error: 'argValue is not a string type'
      };
    }

    try {
      const matchedCol = columns.find(({
        name
      }) => argValue === name);
      const val = matchedCol ? maybeQuoteValue(matchedCol.name) : argValue;
      return (0, _get_form_object.getFormObject)(val);
    } catch (e) {
      return {
        error: e.message
      };
    }
  })(argValue)
})), (0, _stateful_prop.createStatefulPropHoc)('mathValue', 'setMathValue'), (0, _recompose.withHandlers)({
  setMathFunction: ({
    mathValue,
    setMathValue
  }) => fn => setMathValue({ ...mathValue,
    fn
  })
}))(DatacolumnArgInput);
EnhancedDatacolumnArgInput.propTypes = {
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  columns: _propTypes.default.array.isRequired
};

const datacolumn = () => ({
  name: 'datacolumn',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  default: '""',
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(EnhancedDatacolumnArgInput)
});

exports.datacolumn = datacolumn;