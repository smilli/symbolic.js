# symbolic.js [![Build Status](https://travis-ci.org/smilli/symbolic.js.svg?branch=master)](https://travis-ci.org/smilli/symbolic.js)
A client-side symbolic algebra Javascript library.

# Basic Usage
Create a new expression using sy.parse & evaluate the expression by calling
eval.

    var expr = sy.parse('3x^2 + 2x + 1');
    expr.eval('x', 1); \\ returns 6

# Contribute
1. git clone https://github.com/smilli/symbolic.js.git
2. cd symbolic.js
3. npm install

Create a new branch with the added bugfix / feature.  Make sure tests are passing through `grunt test`, and then submit a pull request.
