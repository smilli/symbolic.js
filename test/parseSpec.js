describe('sy.parse', function() {
  it('should parse terminals', function() {
    var expr, expected;
    expr = sy.parse('2');
    expected = new sy.Expr(2);
    expect(expr).toEqual(expected);

    expr = sy.parse('x');
    expected = new sy.Expr(new sy.Symbol('x'));
    expect(expr).toEqual(expected);
  });
});
