"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueueMock = void 0;

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class QueueMock extends _events.default.EventEmitter {
  constructor() {
    super();
  }

  setClient(client) {
    this.client = client;
  }

}

exports.QueueMock = QueueMock;