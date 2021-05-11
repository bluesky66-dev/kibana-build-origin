"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseArray = void 0;

var _react = require("react");

var _helpers = require("../helpers");

var _form_context = require("../form_context");

var _hooks = require("../hooks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Use UseArray to dynamically add fields to your form.
 *
 * example:
 * If your form data looks like this:
 *
 * {
 *   users: []
 * }
 *
 * and you want to be able to add user objects ({ name: 'john', lastName. 'snow' }) inside
 * the "users" array, you would use UseArray to render rows of user objects with 2 fields in each of them ("name" and "lastName")
 *
 * Look at the README.md for some examples.
 */
const UseArray = ({
  path,
  initialNumberOfItems,
  validations,
  readDefaultValueOnForm = true,
  children
}) => {
  const isMounted = (0, _react.useRef)(false);
  const uniqueId = (0, _react.useRef)(0);
  const form = (0, _form_context.useFormContext)();
  const {
    __getFieldDefaultValue
  } = form;
  const getNewItemAtIndex = (0, _react.useCallback)(index => ({
    id: uniqueId.current++,
    path: `${path}[${index}]`,
    isNew: true
  }), [path]);
  const fieldDefaultValue = (0, _react.useMemo)(() => {
    const defaultValues = readDefaultValueOnForm ? __getFieldDefaultValue(path) : undefined;

    const getInitialItemsFromValues = values => values.map((_, index) => ({
      id: uniqueId.current++,
      path: `${path}[${index}]`,
      isNew: false
    }));

    return defaultValues ? getInitialItemsFromValues(defaultValues) : new Array(initialNumberOfItems).fill('').map((_, i) => getNewItemAtIndex(i));
  }, [path, initialNumberOfItems, readDefaultValueOnForm, __getFieldDefaultValue, getNewItemAtIndex]); // Create a new hook field with the "isIncludedInOutput" set to false so we don't use its value to build the final form data.
  // Apart from that the field behaves like a normal field and is hooked into the form validation lifecycle.

  const fieldConfigBase = {
    defaultValue: fieldDefaultValue,
    valueChangeDebounceTime: 0,
    isIncludedInOutput: false
  };
  const fieldConfig = validations ? {
    validations,
    ...fieldConfigBase
  } : fieldConfigBase;
  const field = (0, _hooks.useField)(form, path, fieldConfig);
  const {
    setValue,
    value,
    isChangingValue,
    errors
  } = field; // Derived state from the field

  const error = (0, _react.useMemo)(() => {
    const {
      errorMessage
    } = (0, _helpers.getFieldValidityAndErrorMessage)({
      isChangingValue,
      errors
    });
    return errorMessage;
  }, [isChangingValue, errors]);
  const updatePaths = (0, _react.useCallback)(_rows => {
    return _rows.map((row, index) => ({ ...row,
      path: `${path}[${index}]`
    }));
  }, [path]);
  const addItem = (0, _react.useCallback)(() => {
    setValue(previousItems => {
      const itemIndex = previousItems.length;
      return [...previousItems, getNewItemAtIndex(itemIndex)];
    });
  }, [setValue, getNewItemAtIndex]);
  const removeItem = (0, _react.useCallback)(id => {
    setValue(previousItems => {
      const updatedItems = previousItems.filter(item => item.id !== id);
      return updatePaths(updatedItems);
    });
  }, [setValue, updatePaths]);
  const moveItem = (0, _react.useCallback)((sourceIdx, destinationIdx) => {
    setValue(previousItems => {
      const nextItems = [...previousItems];
      const removed = nextItems.splice(sourceIdx, 1)[0];
      nextItems.splice(destinationIdx, 0, removed);
      return updatePaths(nextItems);
    });
  }, [setValue, updatePaths]);
  (0, _react.useEffect)(() => {
    if (!isMounted.current) {
      return;
    }

    setValue(prev => {
      return updatePaths(prev);
    });
  }, [path, updatePaths, setValue]);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return children({
    items: value,
    error,
    form,
    addItem,
    removeItem,
    moveItem
  });
};

exports.UseArray = UseArray;