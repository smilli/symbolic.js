describe('Expr', function(){
  it('should require a value', function() {
    expect(Expr).toThrow(new Error('Expression must have a value.'));
  });

  it('should work for numbers and symbols', function() {
    var expr, symbol;

    expr = new Expr(2.7);
    expect(expr.value).toBe(2.7);

    expr = new Expr(0);
    expect(expr.value).toBe(0);

    symbol = new Symbol('x');
    expr = new Expr(symbol);
    expect(expr.value).toBe(symbol);
  });

  it('should not allow operands for terminal values', function() {
    expect(function(){
      new Expr(2.7, [5.8, new Symbol('y')]);
    }).toThrow(new Error('An expression without an operator as a value cannot' +
      ' have operands.'));
  });

  it('should require operands if the value is an operator', function() {
    var op;
    var createOpExpr = function(){
      Expr(op);
    };

    for (i = 0; i < OPS.length; i++) {
      op = OPS[i];
      expect(createOpExpr).toThrow(new Error('An expression with an ' +
          'operator as a value must have operands.'));
    }
  });
});
