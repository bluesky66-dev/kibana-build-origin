"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormatWithAggs = getFormatWithAggs;

var _i18n = require("@kbn/i18n");

var _field_formats = require("../../../../common/field_formats");

var _date_range = require("../buckets/lib/date_range");

var _ip_range = require("../buckets/lib/ip_range");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Certain aggs have custom field formats that are not part of the field formats
 * registry. This function will take the `getFormat` function which is used inside
 * `deserializeFieldFormat` and decorate it with the additional custom formats
 * that the field formats service doesn't know anything about.
 *
 * This function is internal to the data plugin, and only exists for use inside
 * the field formats service.
 *
 * @internal
 */
function getFormatWithAggs(getFieldFormat) {
  return mapping => {
    const {
      id,
      params = {}
    } = mapping;
    const customFormats = {
      range: () => {
        const RangeFormat = _field_formats.FieldFormat.from(range => {
          if (range.label) {
            return range.label;
          }

          const nestedFormatter = params;
          const format = getFieldFormat({
            id: nestedFormatter.id,
            params: nestedFormatter.params
          });
          const gte = '\u2265';
          const lt = '\u003c';
          let fromValue = format.convert(range.gte);
          let toValue = format.convert(range.lt); // In case of identity formatter and a specific flag, replace Infinity values by specific strings

          if (params.replaceInfinity && nestedFormatter.id == null) {
            const FROM_PLACEHOLDER = '\u2212\u221E';
            const TO_PLACEHOLDER = '+\u221E';
            fromValue = isFinite(range.gte) ? fromValue : FROM_PLACEHOLDER;
            toValue = isFinite(range.lt) ? toValue : TO_PLACEHOLDER;
          }

          if (params.template === 'arrow_right') {
            return _i18n.i18n.translate('data.aggTypes.buckets.ranges.rangesFormatMessageArrowRight', {
              defaultMessage: '{from} → {to}',
              values: {
                from: fromValue,
                to: toValue
              }
            });
          }

          return _i18n.i18n.translate('data.aggTypes.buckets.ranges.rangesFormatMessage', {
            defaultMessage: '{gte} {from} and {lt} {to}',
            values: {
              gte,
              from: fromValue,
              lt,
              to: toValue
            }
          });
        });

        return new RangeFormat();
      },
      date_range: () => {
        const nestedFormatter = params;

        const DateRangeFormat = _field_formats.FieldFormat.from(range => {
          const format = getFieldFormat({
            id: nestedFormatter.id,
            params: nestedFormatter.params
          });
          return (0, _date_range.convertDateRangeToString)(range, format.convert.bind(format));
        });

        return new DateRangeFormat();
      },
      ip_range: () => {
        const nestedFormatter = params;

        const IpRangeFormat = _field_formats.FieldFormat.from(range => {
          const format = getFieldFormat({
            id: nestedFormatter.id,
            params: nestedFormatter.params
          });
          return (0, _ip_range.convertIPRangeToString)(range, format.convert.bind(format));
        });

        return new IpRangeFormat();
      },
      terms: () => {
        const convert = (val, type) => {
          const format = getFieldFormat({
            id: params.id,
            params
          });

          if (val === '__other__') {
            return params.otherBucketLabel;
          }

          if (val === '__missing__') {
            return params.missingBucketLabel;
          }

          return format.convert(val, type);
        };

        return {
          convert,
          getConverterFor: type => val => convert(val, type)
        };
      }
    };

    if (!id || !(id in customFormats)) {
      return getFieldFormat(mapping);
    }

    return customFormats[id]();
  };
}