/* Symbolic.js module */
var sy = {};


/* Operator constants */
// TODO(smilli): Should get rid of '-' and only use '+' at some point
sy._OPS = ['+', '-', '*', '^', '/'];
sy._OP_ORDERED = {'+': false, '*': false, '^': true, '/': true, '-': true};
sy._OP_PRECEDENCES = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3, '(': 0};
sy._OP_NAMES = {'+': 'Add', '-': 'Sub', '*': 'Mul', '^': 'Exp', '/': 'Div'};


/**
 * Returns whether a value is an operator.
 * @param {*} value - The value to check.
 */
sy.isOperator = function(value) {
  return sy._OPS.indexOf(value) > -1;
};


/**
 * Returns whether a value is a terminal value.
 * @param {*} value - The value to check.
 */
sy.isTerminal = function(value) {
  return typeof value === 'number' || value instanceof sy.Symbol;
};


/**
 * Returns whether an operator's operands depend on order or not.
 * @param {char} op - the operator
 * @returns {bool} true if operator depends on order, false otherwise
 */
sy.isOpOrdered = function(op) {
  return sy._OP_ORDERED[op];
};

/**
 * Applies op to the list of operands.
 * @param {char} op - the operator
 * @param {Number[]} operands - list of operands
 * @returns {Number} - operands evaluated with operator
 */
sy.applyOp = function(op, operands) {
  var result = null;
  for (var i = 0; i < operands.length; i++) {
    if (result === null) {
      result = operands[i];
    } else {
      switch (op) {
        case '+':
          result = result + operands[i];
          break;
        case '-':
          result = result - operands[i];
          break;
        case '*':
          result = result * operands[i];
          break;
        case '/':
          result = result / operands[i];
          break;
        case '^':
          result = Math.pow(result,operands[i]);
          break;
        default:
          throw new Error('Invalid operator');
      }
    }
  }
  return result;
};
