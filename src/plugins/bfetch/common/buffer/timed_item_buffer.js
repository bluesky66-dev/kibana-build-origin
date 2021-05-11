"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimedItemBuffer = void 0;

var _item_buffer = require("./item_buffer");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TimedItemBuffer extends _item_buffer.ItemBuffer {
  constructor(params) {
    super(params);
    this.params = params;

    _defineProperty(this, "timer", void 0);

    _defineProperty(this, "onTimeout", () => {
      this.flush();
    });
  }

  write(item) {
    super.write(item);

    if (this.params.maxItemAge && this.length === 1) {
      this.timer = setTimeout(this.onTimeout, this.params.maxItemAge);
    }
  }

  clear() {
    clearTimeout(this.timer);
    super.clear();
  }

  flush() {
    clearTimeout(this.timer);
    super.flush();
  }

}

exports.TimedItemBuffer = TimedItemBuffer;