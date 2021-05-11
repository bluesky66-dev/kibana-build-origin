"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACCENTED_CHARS = exports.NON_ALPHA_NUMERIC_CHARS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NON_ALPHA_NUMERIC_CHARS = ['#', '@', '.', '$', '*', '(', ')', '+', ';', '~', ':', "'", '/', '%', '?', ',', '=', '&', '!', '-', '_'];
exports.NON_ALPHA_NUMERIC_CHARS = NON_ALPHA_NUMERIC_CHARS;
const ACCENTED_CHARS = ['À', 'à', 'Á', 'á', 'Â', 'â', 'Ã', 'ã', 'Ä', 'ä', 'Ç', 'ç', 'È', 'è', 'É', 'é', 'Ê', 'ê', 'Ë', 'ë', 'Ì', 'ì', 'Í', 'í', 'Î', 'î', 'Ï', 'ï', 'Ñ', 'ñ', 'Ò', 'ò', 'Ó', 'ó', 'Ô', 'ô', 'Õ', 'õ', 'Ö', 'ö', 'Š', 'š', 'Ú', 'ù', 'Û', 'ú', 'Ü', 'û', 'Ù', 'ü', 'Ý', 'ý', 'Ÿ', 'ÿ', 'Ž', 'ž'];
exports.ACCENTED_CHARS = ACCENTED_CHARS;