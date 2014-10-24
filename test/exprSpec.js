describe('Expr', function(){
  it('should require a value', function() {
    expect(sy.Expr).toThrow(new Error('Expression must have a value.'));
  });

  it('should work for numbers and symbols', function() {
    var expr, symbol;

    expr = new sy.Expr(2.7);
    expect(expr.value).toBe(2.7);

    expr = new sy.Expr(0);
    expect(expr.value).toBe(0);

    symbol = new sy.Symbol('x');
    expr = new sy.Expr(symbol);
    expect(expr.value).toBe(symbol);
  });

  it('should not allow operands for terminal values', function() {
    expect(function(){
      new sy.Expr(2.7, [5.8, new sy.Symbol('y')]);
    }).toThrow(new Error('An expression without an operator as a value cannot' +
      ' have operands.'));
  });

  it('should require operands if the value is an operator', function() {
    var op;
    var createOpExpr = function(){
      sy.Expr(op);
    };

    for (i = 0; i < sy._OPS.length; i++) {
      op = sy._OPS[i];
      expect(createOpExpr).toThrow(new Error('An expression with an ' +
          'operator as a value must have operands.'));
    }
  });
});


describe('Expr.removeOperand', function() {
  it('should remove correct operand', function() {
    var expr = new sy.Expr('+', [
      new sy.Expr(2), new sy.Expr(3), new sy.Expr(8)]);
    expr.removeOperand(1);
    expect(expr.operands.length).toBe(2);
    expect(expr.operands[0].value).toBe(2);
    expect(expr.operands[1].value).toBe(8);
  });
});


describe('Expr.addOperands', function() {
  it('should add new operands', function() {
    var expr = new sy.Expr('+', [
      new sy.Expr(2), new sy.Expr(3), new sy.Expr(8)]);
    expr.addOperands([
      new sy.Expr(new sy.Symbol('x')), new sy.Expr(4)]);
    expect(expr.operands.length).toBe(5);
  });

  it('should only add operands that are Exprs', function() {
    var expr = new sy.Expr('+', [
      new sy.Expr(2), new sy.Expr(3), new sy.Expr(8)]);
    expect(function() {
      expr.addOperands([sy.Symbol('x'), 4]);
    }).toThrow(new Error('Operands must be expressions.'));
  });
});


describe('Expr.eval', function() {
  it('should evaluate basic expressions', function() {
    var expr;

    expr = new sy.Expr('+', [new sy.Expr(2), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr.eval(new sy.Symbol('x'), 3)).toBe(5);

    expr = new sy.Expr('-', [new sy.Expr(new sy.Symbol('x')), new sy.Expr(3)]);
    expect(expr.eval(new sy.Symbol('x'), 3)).toBe(0);

    expr = new sy.Expr('*', [new sy.Expr(2), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr.eval('x', 3)).toBe(6);

    expr = new sy.Expr('*', [new sy.Expr(2.58), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr.eval('x', 3.2)).toBe(8.256);

    expr = new sy.Expr('*', [
      new sy.Expr(new sy.Symbol('x')),
      new sy.Expr(new sy.Symbol('x'))
    ]);
    expect(expr.eval('x', 3)).toBe(9);

    expr = new sy.Expr('^', [new sy.Expr(4), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr.eval('x', 3)).toBe(64);

    expr = new sy.Expr('^', [new sy.Expr(new sy.Symbol('x')), new sy.Expr(3)]);
    expect(expr.eval('x', 5)).toBe(125);

    expr = new sy.Expr('/', [new sy.Expr(new sy.Symbol('x')), new sy.Expr(3)]);
    expect(expr.eval('x', 15)).toBe(5);

  });

  it('should evaluate complex expressions', function() {
    var expr;

    expr = sy.parse('4x^3 + 3x^2 + 2x + 1');
    expect(expr.eval('x', 1)).toBe(10);
    expect(expr.eval('x', 0)).toBe(1);
    expect(expr.eval('x', -1)).toBe(-2);


    expr = sy.parse('3z^3 + 5z^2 + 2z + 8');
    expect(expr.eval('z', 0)).toBe(8);
    expect(expr.eval(new sy.Symbol('z'), 2)).toBe(56);
  });
});
