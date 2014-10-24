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
 * Inserts strToInsert into str at index & returns a new string.
 * @param {string} str - the string to insert into
 * @param {index} index - the index in str to insert at
 * @param {string} strToInsert - what to insert into the string
 * @returns {string} the new string
 */
sy.insertInStr = function(str, index, substr) {
  newStr = str.slice(0, index) + substr + str.slice(index);
  return newStr;
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
      // Variables are required to be one char long
      output.push(new sy.Expr(new sy.Symbol(exprStr[index])));
      index++;
      if (index < exprStr.length && sy._isAlpha(exprStr[index])) {
        exprStr = sy.insertInStr(exprStr, index, '*');
      }
    } else if (sy._isDigitOrDecPoint(exprStr[index])) {
      var numString = '';
      while (index < exprStr.length &&
        sy._isDigitOrDecPoint(exprStr[index])) {
        numString += exprStr[index];
        index++;
      }
      // for a number followed by a variable like 2x
      if (index < exprStr.length && sy._isAlpha(exprStr[index])) {
        exprStr = sy.insertInStr(exprStr, index, '*');
      }
      if (isNaN(numString)) {
        throw new Error('Invalid number ' + numString);
      }
      output.push(new sy.Expr(Number(numString)));
    } else if (exprStr[index] === '(') {
      opStack.push(exprStr[index]);
      index++;
    } else if (exprStr[index] === ')') {
      while (opStack.length() > 0 && opStack.peek() !== '(') {
        sy._popOper(output, opStack);
      }
      if (opStack.length() === 0) {
        throw new Error('Found mismatched parentheses while parsing ' +
          'expression.');
      }
      opStack.pop();
      index++;
    } else if (sy.isOperator(exprStr[index])) {
      var newOp = exprStr[index];
      while (opStack.length() > 0 &&
          sy._OP_PRECEDENCES[newOp] <= sy._OP_PRECEDENCES[opStack.peek()]) {
        sy._popOper(output, opStack);
      }
      opStack.push(newOp);
      index++;
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
