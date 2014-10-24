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


/**
 * Evaluates the expression by replacing the given variable with the new value.
 *
 * Does not modify the existing expression.  
 *
 * @param {char|sy.Symbol} variable - The variable to substitute
 * @param {Number} subVal - The value to replace the variable with
 * @returns {Number|Expr} - The number the expression evaluates to or the
 *  remaining expression.
 */
sy.Expr.prototype.eval = function(variable, subVal) {
  if (!(variable instanceof sy.Symbol)) {
    variable = new sy.Symbol(variable);
  }
  return this._evalHelper(variable, subVal);
};

sy.Expr.prototype._evalHelper = function(variable, subVal) {
  if (this.operands.length === 0) {
    if (this.value instanceof sy.Symbol && 
        this.value.equals(variable)) {
      return subVal;
    }
    return this.value;
  }
  var evaluation = null;
  for (var i = 0; i < this.operands.length; i++) {
    evaledOperand = this.operands[i]._evalHelper(variable, subVal);
    if (typeof evaledOperand === 'number') {
      if (evaluation === null) {
        evaluation = evaledOperand;
      } else {
        evaluation = sy.applyOp(this.value, [evaluation, evaledOperand]);
      }
    }
  }
  return evaluation;
};
