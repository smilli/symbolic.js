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
