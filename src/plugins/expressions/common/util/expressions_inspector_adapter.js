"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsInspectorAdapter = void 0;

var _events = require("events");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ExpressionsInspectorAdapter extends _events.EventEmitter {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_ast", {});
  }

  logAST(ast) {
    this._ast = ast;
    this.emit('change', this._ast);
  }

  get ast() {
    return this._ast;
  }

}

exports.ExpressionsInspectorAdapter = ExpressionsInspectorAdapter;