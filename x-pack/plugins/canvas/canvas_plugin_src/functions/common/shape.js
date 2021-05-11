"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shape = shape;
exports.Shape = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let Shape;
exports.Shape = Shape;

(function (Shape) {
  Shape["ARROW"] = "arrow";
  Shape["ARROW_MULTI"] = "arrowMulti";
  Shape["BOOKMARK"] = "bookmark";
  Shape["CIRCLE"] = "circle";
  Shape["CROSS"] = "cross";
  Shape["HEXAGON"] = "hexagon";
  Shape["KITE"] = "kite";
  Shape["PENTAGON"] = "pentagon";
  Shape["RHOMBUS"] = "rhombus";
  Shape["SEMICIRCLE"] = "semicircle";
  Shape["SPEECH_BUBBLE"] = "speechBubble";
  Shape["SQUARE"] = "square";
  Shape["STAR"] = "star";
  Shape["TAG"] = "tag";
  Shape["TRIANGLE"] = "triangle";
  Shape["TRIANGLE_RIGHT"] = "triangleRight";
})(Shape || (exports.Shape = Shape = {}));

function shape() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().shape;
  return {
    name: 'shape',
    aliases: [],
    type: 'shape',
    inputTypes: ['null'],
    help,
    args: {
      shape: {
        types: ['string'],
        help: argHelp.shape,
        aliases: ['_'],
        default: 'square',
        options: Object.values(Shape)
      },
      border: {
        types: ['string'],
        aliases: ['stroke'],
        help: argHelp.border
      },
      borderWidth: {
        types: ['number'],
        aliases: ['strokeWidth'],
        help: argHelp.borderWidth,
        default: 0
      },
      fill: {
        types: ['string'],
        help: argHelp.fill,
        default: 'black'
      },
      maintainAspect: {
        types: ['boolean'],
        help: argHelp.maintainAspect,
        default: false,
        options: [true, false]
      }
    },
    fn: (input, args) => ({
      type: 'shape',
      ...args
    })
  };
}