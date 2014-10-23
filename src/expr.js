/**
 * Represents a variable like x or y that should be treated symbolically.
 * @constructor
 * @param {string} symbolName - The name of the symbol.  For example 'x' or 'y'.
 */
sy.Symbol = function(symbolName) {
  this.symbolName = symbolName;
};


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
 * A node in an expression tree.  Can be an operation, symbol, or number.
 * @constructor
 * @param {(number|Symbol|string)} value - The value of this expression node
 * @param {Expr[]} [operands] - The children of this expression node.  A node
 *  should only have operands if the value is an operator.
 */
sy.Expr = function(value, operands) {
  if (value === undefined) {
    throw new Error('Expression must have a value.');
  }
  this.value = value;
  this.operands = [];
  if (sy.isOperator(value)) {
    if (operands === undefined) {
      throw new Error('An expression with an operator as a value must have ' +
          'operands.');
    }
    this.addOperands(operands);
  } else if (sy.isTerminal(value)) {
    if (operands !== undefined) {
      throw new Error('An expression without an operator as a value cannot ' +
          'have operands.');
    }
  } else {
    throw new Error('Invalid value for expression.');
  }
};

/**
 * Removes the i-th operand.
 * @param {int} index - The index of the operand to remove
 * @return {Expr} - the removed operand
 */
sy.Expr.prototype.removeOperand = function(index) {
  return this.operands.splice(index, 1)[0];
};

/**
 * Extends list of operands with given operands.
 * @param {Expr[]} newOperands - list of new operands to add
 */
sy.Expr.prototype.addOperands = function(newOperands) {
  for (var i = 0; i < newOperands.length; i++) {
    if (!(newOperands[i] instanceof sy.Expr)) {
      throw new Error('Operands must be expressions.');
    }
  }
  this.operands.push.apply(this.operands, newOperands);
};
