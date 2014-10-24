describe('sy.parse', function() {
  it('should parse terminals', function() {
    var expr, expected;
    expr = sy.parse('2');
    expected = new sy.Expr(2);
    expect(expr).toEqual(expected);

    expr = sy.parse('259');
    expected = new sy.Expr(259);
    expect(expr).toEqual(expected);

    expr = sy.parse('34.8');
    expected = new sy.Expr(34.8);
    expect(expr).toEqual(expected);

    expr = sy.parse('0.48');
    expected = new sy.Expr(0.48);
    expect(expr).toEqual(expected);

    expr = sy.parse('.48');
    expected = new sy.Expr(0.48);
    expect(expr).toEqual(expected);

    expr = sy.parse('x');
    expected = new sy.Expr(new sy.Symbol('x'));
    expect(expr).toEqual(expected);
  });

  it('should parse numbers followed by variables using *', function() {
    var expr, expected;
    expr = sy.parse('2.5x');
    expected = new sy.Expr('*', [
      new sy.Expr(2.5), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr).toEqual(expected);
  });

  it('should parse expressions with operators', function() {
    var expr, expected;
    expr = sy.parse('2.54 + x');
    expected = new sy.Expr('+', [
      new sy.Expr(2.54), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr).toEqual(expected);

    expr = sy.parse('2.54 * x');
    expected = new sy.Expr('*', [
      new sy.Expr(2.54), new sy.Expr(new sy.Symbol('x'))]);
    expect(expr).toEqual(expected);

    expr = sy.parse('x^13');
    expected = new sy.Expr('^', [
      new sy.Expr(new sy.Symbol('x')), new sy.Expr(13)]);
    expect(expr).toEqual(expected);

    expr = sy.parse('-3');
    expected = new sy.Expr('-', [
      new sy.Expr(3)
    ]);
    expect(expr).toEqual(expected);

    expr = sy.parse('2.54 - x');
    expected = new sy.Expr('-', [
      new sy.Expr(2.54),
      new sy.Expr(new sy.Symbol('x'))
    ]);
    expect(expr).toEqual(expected);
  });


  it('should only flatten unordered expressions', function() {
    var expr, expected;
    expr = sy.parse('2.54 + x + y');
    expected = new sy.Expr('+', [
      new sy.Expr(2.54),
      new sy.Expr(new sy.Symbol('x')),
      new sy.Expr(new sy.Symbol('y'))
    ]);
    expect(expr).toEqual(expected);

    expr = sy.parse('2.54 * x * y');
    expected = new sy.Expr('*', [
      new sy.Expr(2.54),
      new sy.Expr(new sy.Symbol('x')),
      new sy.Expr(new sy.Symbol('y'))
    ]);
    expect(expr).toEqual(expected);

    expr = sy.parse('2.54 + x - y');
    expected = new sy.Expr('+', [
      new sy.Expr(2.54),
      new sy.Expr('-', [
        new sy.Expr(new sy.Symbol('x')),
        new sy.Expr(new sy.Symbol('y'))
      ])
    ]);
    expect(expr).toEqual(expected);

    expr = sy.parse('6.8 - 3.4 - 6.7');
    expected = new sy.Expr('-', [
      new sy.Expr(6.8),
      new sy.Expr('-', [
        new sy.Expr(3.4),
        new sy.Expr(6.7)
      ])
    ]);
    expect(expr).toEqual(expected);

    expr = sy.parse('6.8/3.4/6.7');
    expected = new sy.Expr('/', [
      new sy.Expr(6.8),
      new sy.Expr('/', [
        new sy.Expr(3.4),
        new sy.Expr(6.7)
      ])
    ]);

    expect(expr).toEqual(expected);
    expect(expr).toEqual(expected);
    expr = sy.parse('2^3^5');
    expected = new sy.Expr('^', [
      new sy.Expr(2),
      new sy.Expr('^', [
        new sy.Expr(3),
        new sy.Expr(5)
      ])
    ]);
    expect(expr).toEqual(expected);
  });

});
