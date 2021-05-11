"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionRendererRegistry = void 0;

var _expression_renderer = require("./expression_renderer");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ExpressionRendererRegistry {
  constructor() {
    _defineProperty(this, "renderers", new Map());
  }

  register(definition) {
    if (typeof definition === 'function') definition = definition();
    const renderer = new _expression_renderer.ExpressionRenderer(definition);
    this.renderers.set(renderer.name, renderer);
  }

  get(id) {
    return this.renderers.get(id) || null;
  }

  toJS() {
    return this.toArray().reduce((acc, renderer) => ({ ...acc,
      [renderer.name]: renderer
    }), {});
  }

  toArray() {
    return [...this.renderers.values()];
  }

}

exports.ExpressionRendererRegistry = ExpressionRendererRegistry;