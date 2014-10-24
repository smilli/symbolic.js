/**
 * Represents a variable like x or y that should be treated symbolically.
 * @constructor
 * @param {string} symbolName - The name of the symbol.  For example 'x' or 'y'.
 */
sy.Symbol = function(symbolName) {
  this.symbolName = symbolName;
};


/**
 * Returns true if the other object is the same as this object.
 * @param {Symbol} - the other object to compare
 * @return {bool} - true if objects are equal, false otherwise
 */
sy.Symbol.prototype.equals = function(other) {
  return (other instanceof sy.Symbol && this.symbolName === other.symbolName);
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
 * Returns true if the other object is the same as this object.
 * @param {Expr} - the other object to compare
 * @return {bool} - true if objects are equal, false otherwise
 */
sy.Expr.prototype.equals = function(other) {
  if (other instanceof sy.Expr &&
      (this.value === other.value || this.value.equals(other.value))) {
    if (this.operands.length !== other.operands.length) {
      return false;
    }
    for (var i = 0; i < this.operands.length; i++) {
      if (!(this.operands[i].equals(other.operands[i]))) {
        return false;
      }
    }
    return true;
  }
  return false;
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
