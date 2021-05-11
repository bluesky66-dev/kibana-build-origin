"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderedElement = exports.RenderedElementComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styleIt = _interopRequireDefault(require("style-it"));

var _positionable = require("../../public/components/positionable/positionable");

var _utils = require("../../public/components/workpad_page/utils");

var _context = require("../context");

var _create_handlers = require("../../public/lib/create_handlers");

var _rendered_elementModule = _interopRequireDefault(require("./rendered_element.module.scss"));

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
/**
 * A Rendered Element is different from an Element added to a Canvas Workpad.  A
 * Rendered Element has actually be evaluated already to gather any data from
 * datasources, and is just a simple expression to render the result.  This
 * component renders that "transient" element state.
 */


class RenderedElementComponent extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "ref", void 0);

    this.ref = /*#__PURE__*/_react.default.createRef();
  }

  componentDidMount() {
    const {
      element,
      fn
    } = this.props;
    const {
      expressionRenderable
    } = element;
    const {
      value
    } = expressionRenderable;
    const {
      as
    } = value;

    if (!this.ref.current) {
      return null;
    }

    try {
      fn.render(this.ref.current, value.value, (0, _create_handlers.createHandlers)());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(as, e.message);
    }
  }

  render() {
    const {
      element,
      index
    } = this.props;
    const shape = (0, _utils.elementToShape)(element, index || 1);
    const {
      id,
      expressionRenderable,
      position
    } = element;
    const {
      value
    } = expressionRenderable;
    const {
      as,
      css: elementCSS,
      containerStyle
    } = value;
    const {
      height,
      width
    } = position;
    return /*#__PURE__*/_react.default.createElement(_positionable.Positionable, {
      height: height,
      width: width,
      transformMatrix: shape.transformMatrix
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: _rendered_elementModule.default.root
    }, _styleIt.default.it(elementCSS, /*#__PURE__*/_react.default.createElement("div", {
      className: _rendered_elementModule.default.container,
      style: { ...containerStyle
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: _rendered_elementModule.default.content
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: _rendered_elementModule.default.renderContainer
    }, /*#__PURE__*/_react.default.createElement("div", {
      key: id,
      ref: this.ref,
      "data-renderer": as,
      className: _rendered_elementModule.default.render
    })))))));
  }

}
/**
 * A store-connected container for the `RenderedElement` component.
 */


exports.RenderedElementComponent = RenderedElementComponent;

_defineProperty(RenderedElementComponent, "contextType", _context.CanvasShareableContext);

const RenderedElement = ({
  index,
  element
}) => {
  const [{
    renderers
  }] = (0, _context.useCanvasShareableState)();
  const {
    expressionRenderable
  } = element;
  const {
    value
  } = expressionRenderable;
  const {
    as
  } = value;
  const fn = renderers[as];
  return /*#__PURE__*/_react.default.createElement(RenderedElementComponent, {
    element,
    fn,
    index
  });
};

exports.RenderedElement = RenderedElement;