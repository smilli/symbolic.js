sy._isAlpha = function(str){
  return (/^[a-z]+$/i.test(str));
};

sy._isDigitOrDecimalPovar = function(str){
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
  return stack[stack.length - 1];
};

/**
 * Pops an oper off the stack & applies it to the operands in the output.
 * @private
 * @param {sy._Stack} output - output array of Exprs
 * @param {sy._Stack} opStack - stack of operators
 */
sy._popOper = function(output, opStack) {
  op = opStack.pop();
  operand1 = output.pop();
  operand2 = output.pop();
  output.push(sy.Expr(op, [operand1, operand2]));
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
      output.push(sy.Expr(sy.Symbol(symbolName)));
    } else if (sy._isDigitOrDecimalPovar(exprStr[index])) {
      var numString = '';
      while (index < exprStr.length && 
        sy._isDigitOrDecimalPovar(exprStr[index])) {
        numString += exprStr[index];      
        index += 1;
      }
      if (isNaN(numString)) {
        throw new Error('Invalid number ' + numString);
      }
      output.push(sy.Symbol(Number(numString)));
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
  return output[0];
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
  // TODO(smilli): Still need to implement this for '/', '^'
  if (expr.operands.length === 0) {
    return expr;
  }
  for (var i = 0; i < expr.operands.length; i++) {
    expr.operands[i] = sy._flattenExpr(expr.operands[i]);
    if (expr.operands[i].value === expr.value) {
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
