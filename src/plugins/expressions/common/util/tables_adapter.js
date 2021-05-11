"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TablesAdapter = void 0;

var _events = require("events");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TablesAdapter extends _events.EventEmitter {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_tables", {});
  }

  logDatatable(name, datatable) {
    this._tables[name] = datatable;
    this.emit('change', this.tables);
  }

  get tables() {
    return this._tables;
  }

}

exports.TablesAdapter = TablesAdapter;