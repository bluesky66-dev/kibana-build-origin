"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBorderStyle = exports.BorderStyle = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let BorderStyle;
exports.BorderStyle = BorderStyle;

(function (BorderStyle) {
  BorderStyle["NONE"] = "none";
  BorderStyle["SOLID"] = "solid";
  BorderStyle["DOTTED"] = "dotted";
  BorderStyle["DASHED"] = "dashed";
  BorderStyle["DOUBLE"] = "double";
  BorderStyle["GROOVE"] = "groove";
  BorderStyle["RIDGE"] = "ridge";
  BorderStyle["INSET"] = "inset";
  BorderStyle["OUTSET"] = "outset";
})(BorderStyle || (exports.BorderStyle = BorderStyle = {}));

const isBorderStyle = style => !!style && Object.values(BorderStyle).includes(style);

exports.isBorderStyle = isBorderStyle;