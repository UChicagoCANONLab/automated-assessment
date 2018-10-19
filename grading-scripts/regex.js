/// Some regex primitives.

var rx = {

    deepStringify: function(object) {

    },

    /// Returns a new RegExp made with a given string.
    create: function(string) {
        console.log(string);
        return new RegExp(string);
    },

    /// Escapes any special characters typed into a string.
    escape: function(string) {
        var exp = /([.*+?^${}()|\[\]\/\\])/g;
        return string.replace(exp, "\\$1");
    },

    /// Turns all whitespace into flexible whitespace.
    flex: function(string) {
        console.log(string);
        return this.escape(string).replace(/\s+/g, "\\s+");
    },

    /// Allows for switch statements.
    or: function() {
        if (!arguments.length) return "";

        var ret = "(";
        for (var i = 0; i < arguments.length - 1; i++) {
            ret = ret + arguments[i] + "|";
        }
        return ret + arguments[arguments.length - 1] + ")";
    },
}
/*

/// test

var code = '["setVar:to:",                 "perimeter", ["+", ["+",     ["readVariable", "height"],             ["readVariable", "height"]],     \
          ["+", ["readVariable", "width"], \n ["readVariable", "width"]]]],';

var isMatch = !!code.match(regexes.perimeter);
console.log(isMatch);
*/
exports = rx;