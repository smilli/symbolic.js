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

sy._isAlpha = function(str){
  return (/^[a-z]+$/i.test(str));
};

sy._isDigitOrDecPoint = function(str){
  return (!/\D/.test(str) || str === '.'); 
};

/**
 * A stack.
 * @private
 * @constructor
 */
sy._Stack = function() {
  this.stack = [];
};

sy._Stack.prototype.length = function() {
  return this.stack.length;
};

sy._Stack.prototype.push = function(item) {
  return this.stack.push(item);
};

sy._Stack.prototype.pop = function() {
  var removedElements = this.stack.splice(-1, 1);
  return removedElements[0];
};

sy._Stack.prototype.peek = function() {
  return this.stack[this.stack.length - 1];
};

/**
 * Pops an oper off the stack & applies it to the operands in the output.
 * @private
 * @param {sy._Stack} output - output array of Exprs
 * @param {sy._Stack} opStack - stack of operators
 */
sy._popOper = function(output, opStack) {
  op = opStack.pop();
  operand2 = output.pop();
  // for unary operators
  if (output.length() === 0) {
    output.push(new sy.Expr(op, [operand2]));
    return;
  }
  operand1 = output.pop();
  output.push(new sy.Expr(op, [operand1, operand2]));
};

/**
 * Parses a string varo an expression using Dijkstra's Shunting Yard algorithm.
 * @private
 * @param {string} exprStr - the string to parse
 * @returns {Expr} the parsed expression
 */
sy._dijkstraParse = function(exprStr) {
  var output = new sy._Stack();
  var opStack = new sy._Stack(); 
  var index = 0;

  while (index < exprStr.length) {
    if (sy._isAlpha(exprStr[index])) {
      var symbolName = '';
      while (index < exprStr.length && sy._isAlpha(exprStr[index])) {
        symbolName += exprStr[index];
        index++;
      }
      output.push(new sy.Expr(new sy.Symbol(symbolName)));
    } else if (sy._isDigitOrDecPoint(exprStr[index])) {
      var numString = '';
      while (index < exprStr.length && 
        sy._isDigitOrDecPoint(exprStr[index])) {
        numString += exprStr[index];      
        index += 1;
      }
      // for a number followed by a variable like 2x
      if (index < exprStr.length && sy._isAlpha(exprStr[index])) {
        exprStr = exprStr.slice(0, index) + '*' + exprStr.slice(index);
      }
      if (isNaN(numString)) {
        throw new Error('Invalid number ' + numString);
      }
      output.push(new sy.Expr(Number(numString)));
    } else if (exprStr[index] === '(') {
      opStack.push(exprStr[index]);
      index += 1;
    } else if (exprStr[index] === ')') {
      while (opStack.length() > 0 && opStack.peek() !== '(') {
        sy._popOper(output, opStack);
      }
      if (opStack.length() === 0) {
        throw new Error('Found mismatched parentheses while parsing ' +
          'expression.');
      }
      opStack.pop();
      index += 1;
    } else if (sy.isOperator(exprStr[index])) {
      var newOp = exprStr[index];
      while (opStack.length > 0 && 
          sy._OP_PRECEDENCES[newOp] <= sy._OP_PRECEDENCES[opStack.peek()]) {
        sy._popOper(output, opStack);
      }
      opStack.push(newOp);
      index += 1;
    } else {
      throw new Error('Malformed expression.');
    }
  }
  while (opStack.length() > 0) {
    if (opStack.peek() === '(') {
      throw new Error('Found mismatched parentheses while parsing expression.');
    }
    sy._popOper(output, opStack);
  }
  if (output.length() > 1) {
    throw new Error('Malformed expression.');
  }
  return output.pop();
};

/**
 * Flattens an Expr object.
 *
 * After calling this function there should be no
 * operators that have the same operator as a child.  For example no '+' should
 * have a '+' as a child.
 *
 * @param {sy.Expr} - the expression to flatten
 */
sy._flattenExpr = function(expr) {
  // TODO(smilli): Should intelligently combine -, /, ^
  if (expr.operands.length === 0) {
    return expr;
  }
  for (var i = 0; i < expr.operands.length; i++) {
    expr.operands[i] = sy._flattenExpr(expr.operands[i]);
    if (!sy.isOpOrdered(expr.value) &&
        expr.operands[i].value === expr.value) {
      expr.addOperands(expr.operands[i].operands);
      expr.removeOperand(i);
    }
  }
  return expr;
};

/**
 * Parses a string varo an expression.
 * @param {string} exprStr - string to parse
 * @returns {sy.Expr} the parsed expression
 */
sy.parse = function(exprStr) {
  exprStr = exprStr.replace(/\s+/g, '');
  expr = sy._dijkstraParse(exprStr);
  expr = sy._flattenExpr(expr);
  return expr;
};
