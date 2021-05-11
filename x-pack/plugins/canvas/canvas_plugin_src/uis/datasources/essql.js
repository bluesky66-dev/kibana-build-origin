"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.essql = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _arg_helpers = require("../../../public/lib/arg_helpers");

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
  Essql: strings
} = _i18n.DataSourceStrings;

class EssqlDatasource extends _react.PureComponent {
  constructor(..._args) {
    super(..._args);

    _defineProperty(this, "defaultQuery", `SELECT * FROM "${this.props.defaultIndex}"`);

    _defineProperty(this, "getQuery", () => (0, _arg_helpers.getSimpleArg)(this.getArgName(), this.props.args)[0]);

    _defineProperty(this, "getArgName", () => {
      const {
        args
      } = this.props;

      if ((0, _arg_helpers.getSimpleArg)('_', args)[0]) {
        return '_';
      }

      if ((0, _arg_helpers.getSimpleArg)('q', args)[0]) {
        return 'q';
      }

      return 'query';
    });

    _defineProperty(this, "setArg", (name, value) => {
      const {
        args,
        updateArgs
      } = this.props;
      updateArgs && updateArgs({ ...args,
        ...(0, _arg_helpers.setSimpleArg)(name, value)
      });
    });

    _defineProperty(this, "onChange", e => {
      const {
        value
      } = e.target;
      this.props.setInvalid(!value.trim());
      this.setArg(this.getArgName(), value);
    });
  }

  componentDidMount() {
    const query = this.getQuery();

    if (typeof query !== 'string') {
      this.setArg(this.getArgName(), this.defaultQuery);
    } else {
      this.props.setInvalid(!query.trim());
    }
  }

  render() {
    const {
      isInvalid
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
      isInvalid: isInvalid,
      label: strings.getLabel(),
      labelAppend: /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
        size: "xs"
      }, /*#__PURE__*/_react.default.createElement(_eui.EuiLink, {
        href: _i18n.SQL_URL,
        target: "_blank"
      }, strings.getLabelAppend()))
    }, /*#__PURE__*/_react.default.createElement(_eui.EuiTextArea, {
      placeholder: this.defaultQuery,
      isInvalid: isInvalid,
      className: "canvasTextArea__code",
      value: this.getQuery(),
      onChange: this.onChange,
      rows: 15
    }));
  }

}

EssqlDatasource.propTypes = {
  args: _propTypes.default.object.isRequired,
  updateArgs: _propTypes.default.func,
  isInvalid: _propTypes.default.bool,
  setInvalid: _propTypes.default.func,
  defaultIndex: _propTypes.default.string
};

const essql = () => ({
  name: 'essql',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  image: 'database',
  template: (0, _template_from_react_component.templateFromReactComponent)(EssqlDatasource)
});

exports.essql = essql;