"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldList = void 0;

var _lodash = require("lodash");

var _index_pattern_field = require("./index_pattern_field");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// extending the array class and using a constructor doesn't work well
// when calling filter and similar so wrapping in a callback.
// to be removed in the future
const fieldList = (specs = [], shortDotsEnable = false) => {
  class FldList extends Array {
    constructor() {
      super();

      _defineProperty(this, "byName", new Map());

      _defineProperty(this, "groups", new Map());

      _defineProperty(this, "setByName", field => this.byName.set(field.name, field));

      _defineProperty(this, "setByGroup", field => {
        if (typeof this.groups.get(field.type) === 'undefined') {
          this.groups.set(field.type, new Map());
        }

        this.groups.get(field.type).set(field.name, field);
      });

      _defineProperty(this, "removeByGroup", field => this.groups.get(field.type).delete(field.name));

      _defineProperty(this, "getAll", () => [...this.byName.values()]);

      _defineProperty(this, "getByName", name => this.byName.get(name));

      _defineProperty(this, "getByType", type => [...(this.groups.get(type) || new Map()).values()]);

      _defineProperty(this, "add", field => {
        const newField = new _index_pattern_field.IndexPatternField({ ...field,
          shortDotsEnable
        });
        this.push(newField);
        this.setByName(newField);
        this.setByGroup(newField);
      });

      _defineProperty(this, "remove", field => {
        this.removeByGroup(field);
        this.byName.delete(field.name);
        const fieldIndex = (0, _lodash.findIndex)(this, {
          name: field.name
        });
        this.splice(fieldIndex, 1);
      });

      _defineProperty(this, "update", field => {
        const newField = new _index_pattern_field.IndexPatternField(field);
        const index = this.findIndex(f => f.name === newField.name);
        this.splice(index, 1, newField);
        this.setByName(newField);
        this.removeByGroup(newField);
        this.setByGroup(newField);
      });

      _defineProperty(this, "removeAll", () => {
        this.length = 0;
        this.byName.clear();
        this.groups.clear();
      });

      _defineProperty(this, "replaceAll", (spcs = []) => {
        this.removeAll();
        spcs.forEach(this.add);
      });

      specs.map(field => this.add(field));
    }

    toSpec({
      getFormatterForField
    } = {}) {
      return { ...this.reduce((collector, field) => {
          collector[field.name] = field.toSpec({
            getFormatterForField
          });
          return collector;
        }, {})
      };
    }

  }

  return new FldList();
};

exports.fieldList = fieldList;