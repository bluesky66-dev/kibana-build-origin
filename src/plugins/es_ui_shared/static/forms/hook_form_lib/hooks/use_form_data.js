"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormData = void 0;

var _react = require("react");

var _lib = require("../lib");

var _form_data_context = require("../form_data_context");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const useFormData = (options = {}) => {
  const {
    watch,
    form
  } = options;
  const ctx = (0, _form_data_context.useFormDataContext)();
  let getFormData;
  let getFormData$;

  if (form !== undefined) {
    getFormData = form.getFormData;
    getFormData$ = form.__getFormData$;
  } else if (ctx !== undefined) {
    ({
      getFormData,
      getFormData$
    } = ctx);
  } else {
    throw new Error('useFormData() must be used within a <FormDataContextProvider /> or you need to pass FormHook object in the options.');
  }

  const initialValue = getFormData$().value;
  const previousRawData = (0, _react.useRef)(initialValue);
  const isMounted = (0, _react.useRef)(false);
  const [formData, setFormData] = (0, _react.useState)(() => (0, _lib.unflattenObject)(previousRawData.current));
  /**
   * We do want to offer to the consumer a handler to serialize the form data that changes each time
   * the formData **state** changes. This is why we added the "formData" dep to the array and added the eslint override.
   */

  const serializer = (0, _react.useCallback)(() => {
    return getFormData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFormData, formData]);
  (0, _react.useEffect)(() => {
    const subscription = getFormData$().subscribe(raw => {
      if (!isMounted.current && Object.keys(raw).length === 0) {
        return;
      }

      if (watch) {
        const pathsToWatchArray = Array.isArray(watch) ? watch : [watch];

        if (pathsToWatchArray.some(path => previousRawData.current[path] !== raw[path])) {
          previousRawData.current = raw; // Only update the state if one of the field we watch has changed.

          setFormData((0, _lib.unflattenObject)(raw));
        }
      } else {
        setFormData((0, _lib.unflattenObject)(raw));
      }
    });
    return subscription.unsubscribe;
  }, [getFormData$, watch]);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!isMounted.current && Object.keys(formData).length === 0) {
    // No field has mounted yet
    return [formData, serializer, false];
  }

  return [formData, serializer, true];
};

exports.useFormData = useFormData;