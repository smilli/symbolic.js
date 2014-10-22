/* Operator constants */
var OPS = ['+', '*', '^', '/'];
var OP_PRECEDENCES = {'+': 1, '*': 2, '/': 2, '^': 3, '(': 0};
var OP_NAMES = {'+': 'Add', '*': 'Mul', '^': 'Exp', '/': 'Div'};


/**
 * Represents a variable like x or y that should be treated symbolically.
 * @constructor
 * @param {string} symbolName - The name of the symbol.  For example 'x' or 'y'.
 */
function Symbol(symbolName) {
  this.symbolName = symbolName;
}


/**
 * Returns whether a value is an operator.
 * @param {*} value - The value to check.
 */
function isOperator(value){
  return OPS.indexOf(value) > -1;
}


/**
 * Returns whether a value is a terminal value.
 * @param {*} value - The value to check.
 */
function isTerminal(value){
  return typeof value === 'number' || value instanceof Symbol;
}


/**
 * A node in an expression tree.  Can be an operation, symbol, or number.
 * @constructor
 * @param {(number|Symbol|string)} value - The value of this expression node
 * @param {Expr[]} [operands] - The children of this expression node.  A node
 *  should only have operands if the value is an operator.
 */
function Expr(value, operands) {
  if (value === undefined) {
    throw new Error('Expression must have a value.');
  }
  this.value = value;
  if (isOperator(value)) {
    if (operands === undefined) {
      throw new Error('An expression with an operator as a value must have ' +
          'operands.');
    }
    this.value = value;
    this.operands = operands;
  } else if (isTerminal(value)) {
    if (operands !== undefined) {
      throw new Error('An expression without an operator as a value cannot ' +
          'have operands.');
    }
    this.value = value;
    this.operands = [];
  } else {
    throw new Error('Invalid value for expression.');
  }
}
