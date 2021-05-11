"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextDecoration = exports.TextAlignment = exports.Overflow = exports.FontWeight = exports.FontStyle = exports.BackgroundSize = exports.BackgroundRepeat = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Enum of supported CSS `background-repeat` properties.
 */
let BackgroundRepeat;
/**
 * Enum of supported CSS `background-size` properties.
 */

exports.BackgroundRepeat = BackgroundRepeat;

(function (BackgroundRepeat) {
  BackgroundRepeat["REPEAT"] = "repeat";
  BackgroundRepeat["REPEAT_NO"] = "no-repeat";
  BackgroundRepeat["REPEAT_X"] = "repeat-x";
  BackgroundRepeat["REPEAT_Y"] = "repeat-y";
  BackgroundRepeat["ROUND"] = "round";
  BackgroundRepeat["SPACE"] = "space";
})(BackgroundRepeat || (exports.BackgroundRepeat = BackgroundRepeat = {}));

let BackgroundSize;
/**
 * Enum of supported CSS `font-style` properties.
 */

exports.BackgroundSize = BackgroundSize;

(function (BackgroundSize) {
  BackgroundSize["AUTO"] = "auto";
  BackgroundSize["CONTAIN"] = "contain";
  BackgroundSize["COVER"] = "cover";
})(BackgroundSize || (exports.BackgroundSize = BackgroundSize = {}));

let FontStyle;
/**
 * Enum of supported CSS `font-weight` properties.
 */

exports.FontStyle = FontStyle;

(function (FontStyle) {
  FontStyle["ITALIC"] = "italic";
  FontStyle["NORMAL"] = "normal";
})(FontStyle || (exports.FontStyle = FontStyle = {}));

let FontWeight;
/**
 * Enum of supported CSS `overflow` properties.
 */

exports.FontWeight = FontWeight;

(function (FontWeight) {
  FontWeight["NORMAL"] = "normal";
  FontWeight["BOLD"] = "bold";
  FontWeight["BOLDER"] = "bolder";
  FontWeight["LIGHTER"] = "lighter";
  FontWeight["ONE"] = "100";
  FontWeight["TWO"] = "200";
  FontWeight["THREE"] = "300";
  FontWeight["FOUR"] = "400";
  FontWeight["FIVE"] = "500";
  FontWeight["SIX"] = "600";
  FontWeight["SEVEN"] = "700";
  FontWeight["EIGHT"] = "800";
  FontWeight["NINE"] = "900";
})(FontWeight || (exports.FontWeight = FontWeight = {}));

let Overflow;
/**
 * Enum of supported CSS `text-align` properties.
 */

exports.Overflow = Overflow;

(function (Overflow) {
  Overflow["AUTO"] = "auto";
  Overflow["HIDDEN"] = "hidden";
  Overflow["SCROLL"] = "scroll";
  Overflow["VISIBLE"] = "visible";
})(Overflow || (exports.Overflow = Overflow = {}));

let TextAlignment;
/**
 * Enum of supported CSS `text-decoration` properties.
 */

exports.TextAlignment = TextAlignment;

(function (TextAlignment) {
  TextAlignment["CENTER"] = "center";
  TextAlignment["JUSTIFY"] = "justify";
  TextAlignment["LEFT"] = "left";
  TextAlignment["RIGHT"] = "right";
})(TextAlignment || (exports.TextAlignment = TextAlignment = {}));

let TextDecoration;
/**
 * Represents the various style properties that can be applied to an element.
 */

exports.TextDecoration = TextDecoration;

(function (TextDecoration) {
  TextDecoration["NONE"] = "none";
  TextDecoration["UNDERLINE"] = "underline";
})(TextDecoration || (exports.TextDecoration = TextDecoration = {}));