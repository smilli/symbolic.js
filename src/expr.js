/**
 * A node in an expression tree.  Can be an operation, symbol, or number.
 * @constructor
 * @param {(number|Symbol|string)} value - The value of this expression node
 * @param {Expr[]} [operands] - The children of this expression node.  A node
 *  should only have operands if the value is an operator.
 */
function Expr(value, operands) {
  this.value = value;
  if (operands === undefined){
    this.operands = [];
  } else {
    this.operands = operands;
  }
}


/**
 * Represents a variable like x or y that should be treated symbolically.
 * @constructor
 * @param {string} symbolName - The name of the symbol.  For example 'x' or 'y'.
 */
function Symbol(symbolName) {
  this.symbolName = symbolName;
}
