'use strict';
var gulp = require('gulp');
var beautify = require('gulp-jsbeautify');
var beautify_css = require('gulp-jsbeautify').css;
var beautify_html = require('gulp-jsbeautify').html;

module.exports = function () {
  gulp.src(['./client/**/*.js', '!./client/bower_components/**/*'])
    .pipe(beautify({
      "indent_size": 4,
      "indent_char": " ",
      "eol": "\n",
      "indent_level": 0,
      "indent_with_tabs": false,
      "preserve_newlines": true,
      "max_preserve_newlines": 10,
      "jslint_happy": false,
      "space_after_anon_function": false,
      "brace_style": "collapse",
      "keep_array_indentation": false,
      "keep_function_indentation": false,
      "space_before_conditional": true,
      "break_chained_methods": false,
      "eval_code": false,
      "unescape_strings": false,
      "wrap_line_length": 0,
      "wrap_attributes": "auto",
      "wrap_attributes_indent_size": 4,
      "end_with_newline": false
    }))
    .pipe(gulp.dest('./build/'));
};

/*

Beautifier Options:
  -s, --indent-size                 Indentation size [4]
  -c, --indent-char                 Indentation character [" "]
  -e, --eol                         character(s) to use as line terminators. (default newline - "\\n")');
  -l, --indent-level                Initial indentation level [0]
  -t, --indent-with-tabs            Indent with tabs, overrides -s and -c
  -p, --preserve-newlines           Preserve line-breaks (--no-preserve-newlines disables)
  -m, --max-preserve-newlines       Number of line-breaks to be preserved in one chunk [10]
  -P, --space-in-paren              Add padding spaces within paren, ie. f( a, b )
  -j, --jslint-happy                Enable jslint-stricter mode
  -a, --space-after-anon-function   Add a space before an anonymous function's parens, ie. function ()
  -b, --brace-style                 [collapse|expand|end-expand|none] ["collapse"]
  -B, --break-chained-methods       Break chained method calls across subsequent lines
  -k, --keep-array-indentation      Preserve array indentation
  -x, --unescape-strings            Decode printable characters encoded in xNN notation
  -w, --wrap-line-length            Wrap lines at next opportunity after N characters [0]
  -X, --e4x                         Pass E4X xml literals through untouched
  -n, --end-with-newline            End output with newline
  -C, --comma-first                 Put commas at the beginning of new line instead of end
  --good-stuff                      Warm the cockles of Crockford's heart


CSS Beautifier Options:
  -s, --indent-size                  Indentation size [4]
  -c, --indent-char                  Indentation character [" "]
  -t, --indent-with-tabs             Indent with tabs, overrides -s and -c
  -e, --eol                          Character(s) to use as line terminators. (default newline - "\\n")
  -n, --end-with-newline             End output with newline
  -L, --selector-separator-newline   Add a newline between multiple selectors
  -N, --newline-between-rules        Add a newline between CSS rules

HTML Beautifier Options:
  -s, --indent-size                  Indentation size [4]
  -c, --indent-char                  Indentation character [" "]
  -t, --indent-with-tabs             Indent with tabs, overrides -s and -c
  -e, --eol                          Character(s) to use as line terminators. (default newline - "\\n")
  -n, --end-with-newline             End output with newline
  -p, --preserve-newlines            Preserve existing line-breaks (--no-preserve-newlines disables)
  -m, --max-preserve-newlines        Maximum number of line-breaks to be preserved in one chunk [10]
  -I, --indent-inner-html            Indent <head> and <body> sections. Default is false.
  -b, --brace-style                  [collapse|expand|end-expand|none] ["collapse"]
  -S, --indent-scripts               [keep|separate|normal] ["normal"]
  -w, --wrap-line-length             Maximum characters per line (0 disables) [250]
  -A, --wrap-attributes              Wrap attributes to new lines [auto|force] ["auto"]
  -i, --wrap-attributes-indent-size  Indent wrapped attributes to after N characters [indent-size]
  -U, --unformatted                  List of tags (defaults to inline) that should not be reformatted
  -E, --extra_liners                 List of tags (defaults to [head,body,/html] that should have an extra newline before them.

*/
