/* Symbolic.js module */
var sy = {};

/* Operator constants */
sy._OPS = ['+', '*', '^', '/'];
sy._OP_PRECEDENCES = {'+': 1, '*': 2, '/': 2, '^': 3, '(': 0};
sy._OP_NAMES = {'+': 'Add', '*': 'Mul', '^': 'Exp', '/': 'Div'};
