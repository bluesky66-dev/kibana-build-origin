"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAxisConfig = exports.Position = exports.Legend = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A `ExpressionFunctionFactory` is a powerful type used for any function that produces
 * an `ExpressionFunction`. If it does not meet the signature for such a function,
 * or if it does not produce an `ExpressionFunction`, it will be typed as
 * returning `never`.
 *
 * This type will, in turn, strongly-type both a factory that produces an
 * `ExpressionFunction`, *and* the `ExpressionFunction` itself.  This means one can
 * effectively introspect properties from the factory in other places.
 *
 * As an example, given the following:
 * 
```
   function foo(): ExpressionFunction<'foo', Context, Arguments, Return> {
     // ...
   }
```
 *
 * `foo` would be an `ExpressionFunctionFactory`.  Using the `FunctionFactory` type allows one to
 * introspect the generics from the `ExpressionFunction` without needing to access it
 * directly:
 * 
```
    type Baz = FunctionFactory<typeof foo>;
```
 *
 * Thus, in reality, and in a Typescript-enabled IDE, one would see the following definition 
 * for `Baz`:
 * 
```
    type Baz = ExpressionFunction<"foo", Context, Arguments, Return>
```
 *
 * Why is this useful?  Given a collection of `ExpressionFunctions` that have been registered
 * with the `Interpreter`, you could take that collection and do any number of other
 * introspected, strongly-typed operations.
 *
 * One example would to create a dictionary of all of the names of the `ExpressionFunctions`
 * that have been registered:
 *
 ```
    const someFunctions = [
      functionOne: ExpressionFunction<'functionOne', Context, Arguments, Return>,
      functionTwo: ExpressionFunction<'functionTwo', Context, Arguments, Return>,
      functionThree: ExpressionFunction<'functionThree', Context, Arguments, Return>,
    ];

    export type FunctionName = FunctionFactory<typeof someFunctions[number]>['name'];
    
    const name: FunctionName = 'functionOne';  // passes
    const nonName: FunctionName = 'elastic`;  // fails
```
 *
 * A more practical example would be to use the introspected generics to create dictionaries, 
 * like of help strings or documentation, that would contain only valid functions and their 
 * generics, but nothing extraneous.  This is actually used in a number of built-in functions 
 * in Kibana and Canvas.
 */
// prettier-ignore

/**
 * `FunctionFactory` exists as a name shim between the `ExpressionFunction` type and
 * the functions that already existed in Canvas.  This type can likely be removed, and
 * callsites converted, if `ExpressionFunctionFactory` is moved into the Interpreter, (perhaps
 * with a shorter name).
 */
// prettier-ignore

/**
 * A collection of all Canvas Functions.
 */

/**
 * Represents a function called by the `case` Function.
 */

let Legend;
exports.Legend = Legend;

(function (Legend) {
  Legend["NORTH_WEST"] = "nw";
  Legend["SOUTH_WEST"] = "sw";
  Legend["NORTH_EAST"] = "ne";
  Legend["SOUTH_EAST"] = "se";
})(Legend || (exports.Legend = Legend = {}));

let Position;
exports.Position = Position;

(function (Position) {
  Position["TOP"] = "top";
  Position["BOTTOM"] = "bottom";
  Position["LEFT"] = "left";
  Position["RIGHT"] = "right";
})(Position || (exports.Position = Position = {}));
/**
 * A Utility function that Typescript can use to determine if an object is an AxisConfig.
 * @param axisConfig
 */


const isAxisConfig = axisConfig => !!axisConfig && axisConfig.type === 'axisConfig';

exports.isAxisConfig = isAxisConfig;