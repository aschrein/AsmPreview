import GoldenLayout from 'golden-layout';
import React from 'react';
import ReactDOM from 'react-dom';
// import Markdown from 'react-markdown';
import './css/main.css';
import AceEditor from 'react-ace';
import 'brace/mode/assembly_x86';
// import './3rdparty/glsl';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/vibrant_ink';
import 'brace/ext/language_tools';
// import { JSONEditor } from 'react-json-editor-viewer';
import * as dat from 'dat.gui';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';

var define_hlsl = function () {
  let ace = global.ace;
  ace.define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../lib/oop");
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var DocCommentHighlightRules = function () {
      this.$rules = {
        "start": [{
          token: "comment.doc.tag",
          regex: "@[\\w\\d_]+" // TODO: fix email addresses
        },
        DocCommentHighlightRules.getTagRule(),
        {
          defaultToken: "comment.doc",
          caseInsensitive: true
        }]
      };
    };

    oop.inherits(DocCommentHighlightRules, TextHighlightRules);

    DocCommentHighlightRules.getTagRule = function (start) {
      return {
        token: "comment.doc.tag.storage.type",
        regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
      };
    };

    DocCommentHighlightRules.getStartRule = function (start) {
      return {
        token: "comment.doc", // doc comment
        regex: "\\/\\*(?=\\*)",
        next: start
      };
    };

    DocCommentHighlightRules.getEndRule = function (start) {
      return {
        token: "comment.doc", // closing comment
        regex: "\\*\\/",
        next: start
      };
    };


    exports.DocCommentHighlightRules = DocCommentHighlightRules;

  });

  ace.define("ace/mode/c_cpp_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../lib/oop");
    var DocCommentHighlightRules = acequire("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;
    var cFunctions = exports.cFunctions = "\\b(?:hypot(?:f|l)?|s(?:scanf|ystem|nprintf|ca(?:nf|lb(?:n(?:f|l)?|ln(?:f|l)?))|i(?:n(?:h(?:f|l)?|f|l)?|gn(?:al|bit))|tr(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?)|error|pbrk|ftime|len|rchr|xfrm)|printf|et(?:jmp|vbuf|locale|buf)|qrt(?:f|l)?|w(?:scanf|printf)|rand)|n(?:e(?:arbyint(?:f|l)?|xt(?:toward(?:f|l)?|after(?:f|l)?))|an(?:f|l)?)|c(?:s(?:in(?:h(?:f|l)?|f|l)?|qrt(?:f|l)?)|cos(?:h(?:f)?|f|l)?|imag(?:f|l)?|t(?:ime|an(?:h(?:f|l)?|f|l)?)|o(?:s(?:h(?:f|l)?|f|l)?|nj(?:f|l)?|pysign(?:f|l)?)|p(?:ow(?:f|l)?|roj(?:f|l)?)|e(?:il(?:f|l)?|xp(?:f|l)?)|l(?:o(?:ck|g(?:f|l)?)|earerr)|a(?:sin(?:h(?:f|l)?|f|l)?|cos(?:h(?:f|l)?|f|l)?|tan(?:h(?:f|l)?|f|l)?|lloc|rg(?:f|l)?|bs(?:f|l)?)|real(?:f|l)?|brt(?:f|l)?)|t(?:ime|o(?:upper|lower)|an(?:h(?:f|l)?|f|l)?|runc(?:f|l)?|gamma(?:f|l)?|mp(?:nam|file))|i(?:s(?:space|n(?:ormal|an)|cntrl|inf|digit|u(?:nordered|pper)|p(?:unct|rint)|finite|w(?:space|c(?:ntrl|type)|digit|upper|p(?:unct|rint)|lower|al(?:num|pha)|graph|xdigit|blank)|l(?:ower|ess(?:equal|greater)?)|al(?:num|pha)|gr(?:eater(?:equal)?|aph)|xdigit|blank)|logb(?:f|l)?|max(?:div|abs))|di(?:v|fftime)|_Exit|unget(?:c|wc)|p(?:ow(?:f|l)?|ut(?:s|c(?:har)?|wc(?:har)?)|error|rintf)|e(?:rf(?:c(?:f|l)?|f|l)?|x(?:it|p(?:2(?:f|l)?|f|l|m1(?:f|l)?)?))|v(?:s(?:scanf|nprintf|canf|printf|w(?:scanf|printf))|printf|f(?:scanf|printf|w(?:scanf|printf))|w(?:scanf|printf)|a_(?:start|copy|end|arg))|qsort|f(?:s(?:canf|e(?:tpos|ek))|close|tell|open|dim(?:f|l)?|p(?:classify|ut(?:s|c|w(?:s|c))|rintf)|e(?:holdexcept|set(?:e(?:nv|xceptflag)|round)|clearexcept|testexcept|of|updateenv|r(?:aiseexcept|ror)|get(?:e(?:nv|xceptflag)|round))|flush|w(?:scanf|ide|printf|rite)|loor(?:f|l)?|abs(?:f|l)?|get(?:s|c|pos|w(?:s|c))|re(?:open|e|ad|xp(?:f|l)?)|m(?:in(?:f|l)?|od(?:f|l)?|a(?:f|l|x(?:f|l)?)?))|l(?:d(?:iv|exp(?:f|l)?)|o(?:ngjmp|cal(?:time|econv)|g(?:1(?:p(?:f|l)?|0(?:f|l)?)|2(?:f|l)?|f|l|b(?:f|l)?)?)|abs|l(?:div|abs|r(?:int(?:f|l)?|ound(?:f|l)?))|r(?:int(?:f|l)?|ound(?:f|l)?)|gamma(?:f|l)?)|w(?:scanf|c(?:s(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?|mbs)|pbrk|ftime|len|r(?:chr|tombs)|xfrm)|to(?:b|mb)|rtomb)|printf|mem(?:set|c(?:hr|py|mp)|move))|a(?:s(?:sert|ctime|in(?:h(?:f|l)?|f|l)?)|cos(?:h(?:f|l)?|f|l)?|t(?:o(?:i|f|l(?:l)?)|exit|an(?:h(?:f|l)?|2(?:f|l)?|f|l)?)|b(?:s|ort))|g(?:et(?:s|c(?:har)?|env|wc(?:har)?)|mtime)|r(?:int(?:f|l)?|ound(?:f|l)?|e(?:name|alloc|wind|m(?:ove|quo(?:f|l)?|ainder(?:f|l)?))|a(?:nd|ise))|b(?:search|towc)|m(?:odf(?:f|l)?|em(?:set|c(?:hr|py|mp)|move)|ktime|alloc|b(?:s(?:init|towcs|rtowcs)|towc|len|r(?:towc|len))))\\b";

    var c_cppHighlightRules = function () {

      var keywordControls = (
        "break|case|continue|default|do|else|for|goto|if|_Pragma|" +
        "return|switch|while|catch|operator|try|throw|using"
      );

      var storageType = (
        "asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|" +
        "_Imaginary|int|long|short|signed|struct|typedef|union|unsigned|void|" +
        "class|wchar_t|template|char16_t|char32_t"
      );

      var storageModifiers = (
        "const|extern|register|restrict|static|volatile|inline|private|" +
        "protected|public|friend|explicit|virtual|export|mutable|typename|" +
        "constexpr|new|delete|alignas|alignof|decltype|noexcept|thread_local"
      );

      var keywordOperators = (
        "and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eq" +
        "const_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace"
      );

      var builtinConstants = (
        "NULL|true|false|TRUE|FALSE|nullptr"
      );

      var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.control": keywordControls,
        "storage.type": storageType,
        "storage.modifier": storageModifiers,
        "keyword.operator": keywordOperators,
        "variable.language": "this",
        "constant.language": builtinConstants
      }, "identifier");

      var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";
      var escapeRe = /\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/.source;
      var formatRe = "%"
        + /(\d+\$)?/.source // field (argument #)
        + /[#0\- +']*/.source // flags
        + /[,;:_]?/.source // separator character (AltiVec)
        + /((-?\d+)|\*(-?\d+\$)?)?/.source // minimum field width
        + /(\.((-?\d+)|\*(-?\d+\$)?)?)?/.source // precision
        + /(hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?/.source // length modifier
        + /(\[[^"\]]+\]|[diouxXDOUeEfFgGaACcSspn%])/.source; // conversion type

      this.$rules = {
        "start": [
          {
            token: "comment",
            regex: "//$",
            next: "start"
          }, {
            token: "comment",
            regex: "//",
            next: "singleLineComment"
          },
          DocCommentHighlightRules.getStartRule("doc-start"),
          {
            token: "comment", // multi line comment
            regex: "\\/\\*",
            next: "comment"
          }, {
            token: "string", // character
            regex: "'(?:" + escapeRe + "|.)?'"
          }, {
            token: "string.start",
            regex: '"',
            stateName: "qqstring",
            next: [
              { token: "string", regex: /\\\s*$/, next: "qqstring" },
              { token: "constant.language.escape", regex: escapeRe },
              { token: "constant.language.escape", regex: formatRe },
              { token: "string.end", regex: '"|$', next: "start" },
              { defaultToken: "string" }
            ]
          }, {
            token: "string.start",
            regex: 'R"\\(',
            stateName: "rawString",
            next: [
              { token: "string.end", regex: '\\)"', next: "start" },
              { defaultToken: "string" }
            ]
          }, {
            token: "constant.numeric", // hex
            regex: "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
          }, {
            token: "constant.numeric", // float
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
          }, {
            token: "keyword", // pre-compiler directives
            regex: "#\\s*(?:include|import|pragma|line|define|undef)\\b",
            next: "directive"
          }, {
            token: "keyword", // special case pre-compiler directive
            regex: "#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b"
          }, {
            token: "support.function.C99.c",
            regex: cFunctions
          }, {
            token: keywordMapper,
            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*"
          }, {
            token: "keyword.operator",
            regex: /--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/
          }, {
            token: "punctuation.operator",
            regex: "\\?|\\:|\\,|\\;|\\."
          }, {
            token: "paren.lparen",
            regex: "[[({]"
          }, {
            token: "paren.rparen",
            regex: "[\\])}]"
          }, {
            token: "text",
            regex: "\\s+"
          }
        ],
        "comment": [
          {
            token: "comment", // closing comment
            regex: "\\*\\/",
            next: "start"
          }, {
            defaultToken: "comment"
          }
        ],
        "singleLineComment": [
          {
            token: "comment",
            regex: /\\$/,
            next: "singleLineComment"
          }, {
            token: "comment",
            regex: /$/,
            next: "start"
          }, {
            defaultToken: "comment"
          }
        ],
        "directive": [
          {
            token: "constant.other.multiline",
            regex: /\\/
          },
          {
            token: "constant.other.multiline",
            regex: /.*\\/
          },
          {
            token: "constant.other",
            regex: "\\s*<.+?>",
            next: "start"
          },
          {
            token: "constant.other", // single line
            regex: '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
            next: "start"
          },
          {
            token: "constant.other", // single line
            regex: "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
            next: "start"
          },
          {
            token: "constant.other",
            regex: /[^\\\/]+/,
            next: "start"
          }
        ]
      };

      this.embedRules(DocCommentHighlightRules, "doc-",
        [DocCommentHighlightRules.getEndRule("start")]);
      this.normalizeRules();
    };

    oop.inherits(c_cppHighlightRules, TextHighlightRules);

    exports.c_cppHighlightRules = c_cppHighlightRules;
  });

  ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (acequire, exports, module) {
    "use strict";

    var Range = acequire("../range").Range;

    var MatchingBraceOutdent = function () { };

    (function () {

      this.checkOutdent = function (line, input) {
        if (! /^\s+$/.test(line))
          return false;

        return /^\s*\}/.test(input);
      };

      this.autoOutdent = function (doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({ row: row, column: column });

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column - 1), indent);
      };

      this.$getIndent = function (line) {
        return line.match(/^\s*/)[0];
      };

    }).call(MatchingBraceOutdent.prototype);

    exports.MatchingBraceOutdent = MatchingBraceOutdent;
  });

  ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../../lib/oop");
    var Range = acequire("../../range").Range;
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function (commentRegex) {
      if (commentRegex) {
        this.foldingStartMarker = new RegExp(
          this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
          this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
      }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function () {

      this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
      this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
      this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
      this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
      this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
      this._getFoldWidgetBase = this.getFoldWidget;
      this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);

        if (this.singleLineBlockCommentRe.test(line)) {
          if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
            return "";
        }

        var fw = this._getFoldWidgetBase(session, foldStyle, row);

        if (!fw && this.startRegionRe.test(line))
          return "start"; // lineCommentRegionStart

        return fw;
      };

      this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);

        if (this.startRegionRe.test(line))
          return this.getCommentRegionBlock(session, line, row);

        var match = line.match(this.foldingStartMarker);
        if (match) {
          var i = match.index;

          if (match[1])
            return this.openingBracketBlock(session, match[1], row, i);

          var range = session.getCommentFoldRange(row, i + match[0].length, 1);

          if (range && !range.isMultiLine()) {
            if (forceMultiline) {
              range = this.getSectionRange(session, row);
            } else if (foldStyle != "all")
              range = null;
          }

          return range;
        }

        if (foldStyle === "markbegin")
          return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
          var i = match.index + match[0].length;

          if (match[1])
            return this.closingBracketBlock(session, match[1], row, i);

          return session.getCommentFoldRange(row, i, -1);
        }
      };

      this.getSectionRange = function (session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
          line = session.getLine(row);
          var indent = line.search(/\S/);
          if (indent === -1)
            continue;
          if (startIndent > indent)
            break;
          var subRange = this.getFoldWidgetRange(session, "all", row);

          if (subRange) {
            if (subRange.start.row <= startRow) {
              break;
            } else if (subRange.isMultiLine()) {
              row = subRange.end.row;
            } else if (startIndent == indent) {
              break;
            }
          }
          endRow = row;
        }

        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
      };
      this.getCommentRegionBlock = function (session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;

        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
          line = session.getLine(row);
          var m = re.exec(line);
          if (!m) continue;
          if (m[1]) depth--;
          else depth++;

          if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
          return new Range(startRow, startColumn, endRow, line.length);
        }
      };

    }).call(FoldMode.prototype);

  });

  ace.define("ace/mode/c_cpp", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/c_cpp_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../lib/oop");
    var TextMode = acequire("./text").Mode;
    var c_cppHighlightRules = acequire("./c_cpp_highlight_rules").c_cppHighlightRules;
    var MatchingBraceOutdent = acequire("./matching_brace_outdent").MatchingBraceOutdent;
    var Range = acequire("../range").Range;
    var CstyleBehaviour = acequire("./behaviour/cstyle").CstyleBehaviour;
    var CStyleFoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function () {
      this.HighlightRules = c_cppHighlightRules;

      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();

      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, TextMode);

    (function () {

      this.lineCommentStart = "//";
      this.blockComment = { start: "/*", end: "*/" };

      this.getNextLineIndent = function (state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length - 1].type == "comment") {
          return indent;
        }

        if (state == "start") {
          var match = line.match(/^.*[\{\(\[]\s*$/);
          if (match) {
            indent += tab;
          }
        } else if (state == "doc-start") {
          if (endState == "start") {
            return "";
          }
          var match = line.match(/^\s*(\/?)\*/);
          if (match) {
            if (match[1]) {
              indent += " ";
            }
            indent += "* ";
          }
        }

        return indent;
      };

      this.checkOutdent = function (state, line, input) {
        return this.$outdent.checkOutdent(line, input);
      };

      this.autoOutdent = function (state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
      };

      this.$id = "ace/mode/c_cpp";
    }).call(Mode.prototype);

    exports.Mode = Mode;
  });

  ace.define("ace/mode/hlsl_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/c_cpp_highlight_rules"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../lib/oop");
    var c_cppHighlightRules = acequire("./c_cpp_highlight_rules").c_cppHighlightRules;

    var hlslHighlightRules = function () {

      var keywords = (
        "float2|float3|float4|int2|int3|int4|uint2|uint3|uint4|SV_TARGET|POSITION|TEXCOORD0|" +
        "attribute|const|uniform|varying|break|continue|do|for|while|" +
        "if|else|in|out|inout|float|int|void|bool|true|false|" +
        "lowp|mediump|highp|precision|invariant|discard|return|mat2|mat3|" +
        "mat4|vec2|vec3|vec4|ivec2|ivec3|ivec4|bvec2|bvec3|bvec4|sampler2D|" +
        "samplerCube|struct"
      );

      var buildinConstants = (
        "radians|degrees|sin|cos|tan|asin|acos|atan|pow|" +
        "exp|log|exp2|log2|sqrt|inversesqrt|abs|sign|floor|ceil|fract|mod|" +
        "min|max|clamp|mix|step|smoothstep|length|distance|dot|cross|" +
        "normalize|faceforward|reflect|refract|matrixCompMult|lessThan|" +
        "lessThanEqual|greaterThan|greaterThanEqual|equal|notEqual|any|all|" +
        "not|dFdx|dFdy|fwidth|texture2D|texture2DProj|texture2DLod|" +
        "texture2DProjLod|textureCube|textureCubeLod|" +
        "gl_MaxVertexAttribs|gl_MaxVertexUniformVectors|gl_MaxVaryingVectors|" +
        "gl_MaxVertexTextureImageUnits|gl_MaxCombinedTextureImageUnits|" +
        "gl_MaxTextureImageUnits|gl_MaxFragmentUniformVectors|gl_MaxDrawBuffers|" +
        "gl_DepthRangeParameters|gl_DepthRange|" +
        "gl_Position|gl_PointSize|" +
        "gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_FragColor|gl_FragData"
      );

      var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "constant.language": buildinConstants
      }, "identifier");

      this.$rules = new c_cppHighlightRules().$rules;
      this.$rules.start.forEach(function (rule) {
        if (typeof rule.token == "function")
          rule.token = keywordMapper;
      });
    };

    oop.inherits(hlslHighlightRules, c_cppHighlightRules);

    exports.hlslHighlightRules = hlslHighlightRules;
  });

  ace.define("ace/mode/hlsl", ["require", "exports", "module", "ace/lib/oop", "ace/mode/c_cpp", "ace/mode/hlsl_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (acequire, exports, module) {
    "use strict";

    var oop = acequire("../lib/oop");
    var CMode = acequire("./c_cpp").Mode;
    var hlslHighlightRules = acequire("./hlsl_highlight_rules").hlslHighlightRules;
    var MatchingBraceOutdent = acequire("./matching_brace_outdent").MatchingBraceOutdent;
    var Range = acequire("../range").Range;
    var CstyleBehaviour = acequire("./behaviour/cstyle").CstyleBehaviour;
    var CStyleFoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function () {
      this.HighlightRules = hlslHighlightRules;

      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, CMode);

    (function () {
      this.$id = "ace/mode/hlsl";
    }).call(Mode.prototype);

    exports.Mode = Mode;
  });

}


define_hlsl();

let global_state = {}

class TextEditorComponent extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.compile = this.compile.bind(this);
    this.load = this.load.bind(this);
    this.text = "";
    this.token = "";
  }

  componentDidMount() {
    this.props.glContainer.on('resize', this.onResize);
    this.refs.editor.editor.setValue(
      `
#define DX12_PUSH_CONSTANTS_REGISTER register(b0, space777)
#define u32 uint
#define i32 int
#define f32 float
#define f64 double
#define HLSL
#define float2_splat(x)  float2(x, x)
#define float3_splat(x)  float3(x, x, x)
#define float4_splat(x)  float4(x, x, x, x)

struct PushConstants {
  float4x4 model;
  u32      normal_offset;
  u32      normal_stride;
  u32      position_offset;
  u32      position_stride;
  u32      first_vertex;
  u32      index_offset;
  u32      index_count;
  u32      index_stride;
  u32      flags;
};

#define RASTERIZATION_FLAG_CULL_PIXELS 0x1

#define RASTERIZATION_GROUP_SIZE 64

struct FrameConstants {
  float4x4 viewproj;
};

struct GI_PushConstants {
  float4x4 model;
  u32      cell_x;
  u32      cell_y;
  u32      flags;
};
#define COUNTER_GRID_RESOLUTION 16
#define GI_RASTERIZATION_GROUP_SIZE 8
#define GI_RASTERIZATION_FLAG_PIXEL_COLOR_TRIANGLES 0x2

[[vk::push_constant]] ConstantBuffer<GI_PushConstants> pc : DX12_PUSH_CONSTANTS_REGISTER;

[[vk::binding(0, 1)]] ConstantBuffer<FrameConstants> fc : register(b0, space1);

// Buffer for debugging
// [[vk::binding(0, 2)]] RWByteAddressBuffer feedback_buffer : register(u0, space2);

// Source Buffers
[[vk::binding(0, 0)]] Texture2D<float4> position_source : register(t0, space0);
[[vk::binding(1, 0)]] Texture2D<float4> normal_source : register(t1, space0);
// Target Buffers
[[vk::binding(2, 0)]] RWTexture2D<float4> normal_target : register(u2, space0);
[[vk::binding(3, 0)]] RWTexture2D<uint>   depth_target : register(u3, space0);
// Atomic counter for max pixels/triangle per patch
[[vk::binding(4, 0)]] RWTexture2D<uint> counter_grid : register(u4, space0);

[[vk::binding(5, 0)]] SamplerState ss : register(s5, space0);

//
[[vk::binding(6, 0)]] RWByteAddressBuffer indirect_arg_buffer : register(u6, space0);
[[vk::binding(7, 0)]] RWTexture2D<uint>   prev_counter_grid : register(u7, space0);

struct IndirectArgs {
  u32 dimx;
  u32 dimy;
  u32 dimz;
};

bool in_bounds(float4 p) { return p.w > 0.0 && p.z > 0.0 && abs(p.x) < p.w && abs(p.y) < p.w; }

bool outside(int2 e1, int2 e2) { return e2.x * e1.y - e2.y * e1.x < 0; }
bool outside(float2 e1, float2 e2) { return e2.x * e1.y - e2.y * e1.x < 0.0f; }

void add_sample(float2 uv, u32 num) {
  u32 width, height;
  counter_grid.GetDimensions(width, height);
  u32 ix = uv.x * width;
  u32 iy = uv.y * height;
  InterlockedMax(counter_grid[int2(ix, iy)], num);
  // InterlockedAdd(counter_grid[int2(ix, iy)], num);
}

float3 random_color(float2 uv) {
  uv           = frac(uv * 15.718281828459045);
  float3 seeds = float3(0.123, 0.456, 0.789);
  seeds        = frac((uv.x + 0.5718281828459045 + seeds) *
                ((seeds + fmod(uv.x, 0.141592653589793)) * 27.61803398875 + 4.718281828459045));
  seeds        = frac((uv.y + 0.5718281828459045 + seeds) *
                ((seeds + fmod(uv.y, 0.141592653589793)) * 27.61803398875 + 4.718281828459045));
  seeds        = frac((0.5718281828459045 + seeds) *
                ((seeds + fmod(uv.x, 0.141592653589793)) * 27.61803398875 + 4.718281828459045));
  return seeds;
}

struct Vertex {
  float4 v;
  // float3 normal;
  float2 uv;
};

// Returns the number of visible pixels
// pp_i - position in clip space
u32 rasterize_triangle(RWTexture2D<float4> target, Vertex vtx0, Vertex vtx1, Vertex vtx2,
                        float mip_level) {
  // Target resolution
  uint width, height;
  target.GetDimensions(width, height);

  // float4 pp0 = vtx0.pos;
  // float4 pp1 = vtx1.pos;
  // float4 pp2 = vtx2.pos;
  // float3 normal_0 = vtx0.normal;
  // float3 normal_1 = vtx1.normal;
  // float3 normal_2 = vtx2.normal;

  // Edges
  float2 n0 = vtx1.v.xy - vtx0.v.xy;
  float2 n1 = vtx2.v.xy - vtx1.v.xy;
  float2 n2 = vtx0.v.xy - vtx2.v.xy;

  // Double area
  float area2 = (n0.x * n2.y - n0.y * n2.x);

  // Back/small triangle culling
  if (area2 < 1.0e-6f) return 0;

  // 2D Edge Normals
  n0 = -float2(-n0.y, n0.x) / area2;
  n1 = -float2(-n1.y, n1.x) / area2;
  n2 = -float2(-n2.y, n2.x) / area2;

  // Bounding Box
  float2 fmin =
      float2(min(vtx0.v.x, min(vtx1.v.x, vtx2.v.x)), min(vtx0.v.y, min(vtx1.v.y, vtx2.v.y)));
  float2 fmax =
      float2(max(vtx0.v.x, max(vtx1.v.x, vtx2.v.x)), max(vtx0.v.y, max(vtx1.v.y, vtx2.v.y)));

  int2 imin = int2(fmin);
  int2 imax = int2(fmax);

  imax.x = min(width - 1, max(0, imax.x));
  imax.y = min(height - 1, max(0, imax.y));

  // Edge function values at the first (imin.x + 0.5f, imin.y + 0.5f) sample position
  float2 first_sample = float2(imin) + float2(0.5f, 0.5f);
  float  init_ef0     = dot(first_sample - vtx0.v.xy, n0);
  float  init_ef1     = dot(first_sample - vtx1.v.xy, n1);
  float  init_ef2     = dot(first_sample - vtx2.v.xy, n2);

  u32 num_samples = 0;

  // Bound the maximum triangle size to 8x8 pixels
  // imax.x = imin.x + min(8, imax.x - imin.x);
  // imax.y = imin.y + min(8, imax.y - imin.y);

  //[unroll(8)]
  //{
  //  i32 x = imin.x + (imax.x - imin.x) / 2;
  //  i32 y = imin.y + (imax.y - imin.y) / 2;
  //  // Barycentrics
  //  float b0 = 0.3f;
  //  float b1 = 0.3f;
  //  float b2 = 0.3f;
  //  // Perspective correction
  //  float bw    = b0 / pp0.w + b1 / pp1.w + b2 / pp2.w;
  //  b0          = b0 / pp0.w / bw;
  //  b1          = b1 / pp1.w / bw;
  //  b2          = b2 / pp2.w / bw;
  //  float depth = pp0.z * b0 + pp1.z * b1 + pp2.z * b2;
  //  // Per pixel Attributes
  //  // float2 pixel_uv = suv0 * b0 + suv1 * b1 + suv2 * b2;

  //  // add tid.x * 1.0e-6f to avoid z-fight
  //  u32 idepth = u32((depth)*1000000);
  //  u32 next_depth;
  //  InterlockedMax(depth_target[int2(x, y)], idepth, next_depth);
  //  if (idepth > next_depth) {
  //    num_samples++;
  //    if (pc.flags & GI_RASTERIZATION_FLAG_PIXEL_COLOR_TRIANGLES)
  //      // target[int2(x, y)] = float4(float2_splat(mip_level / 10.0f),
  //      // random_color(suv0).z, 1.0f);
  //      target[int2(x, y)] = float4(b0, b1, b2, 1.0f);
  //    else {
  //      float3 pixel_normal = normalize(normal_0 * b0 + normal_1 * b1 + normal_2 * b2);
  //      target[int2(x, y)] =
  //          float4(float3_splat(max(0.0f, dot(pixel_normal,
  //          normalize(float3_splat(1.0f))))), 1.0f);
  //    }
  //  }
  //}
#if 1
  for (i32 dy = 0; dy <= imax.y - imin.y; dy += 1) {

    //[unroll(8)]
    for (i32 dx = 0; dx <= imax.x - imin.x; dx += 1) {
      i32   x   = imin.x + dx;
      i32   y   = imin.y + dy;
      float ef0 = init_ef0 + n0.y * float(dy) + n0.x * float(dx);
      float ef1 = init_ef1 + n1.y * float(dy) + n1.x * float(dx);
      float ef2 = init_ef2 + n2.y * float(dy) + n2.x * float(dx);
      if (ef0 > 0.0f && ef1 > 0.0f && ef2 > 0.0f) {
        // Barycentrics
        float b0 = ef1;
        float b1 = ef2;
        float b2 = ef0;
        // Perspective correction
        float bw = b0 / vtx0.v.w + b1 / vtx1.v.w + b2 / vtx2.v.w;

        b0          = b0 / vtx0.v.w / bw;
        b1          = b1 / vtx1.v.w / bw;
        b2          = b2 / vtx2.v.w / bw;
        float depth = vtx0.v.z * b0 + vtx1.v.z * b1 + vtx2.v.z * b2;
        // Per pixel Attributes
        float2 pixel_uv = vtx0.uv * b0 + vtx1.uv * b1 + vtx2.uv * b2;

        // add tid.x * 1.0e-6f to avoid z-fight
        u32 idepth = u32((depth)*1000000);
        u32 next_depth;
        InterlockedMax(depth_target[int2(x, y)], idepth, next_depth);
        if (idepth > next_depth) {
          num_samples++;
          if (pc.flags & GI_RASTERIZATION_FLAG_PIXEL_COLOR_TRIANGLES)
            // target[int2(x, y)] = float4(float2_splat(mip_level / 10.0f),
            // random_color(suv0).z, 1.0f);
            target[int2(x, y)] = float4(b0, b1, b2, 1.0f);
          else {
            // float3 pixel_normal = normalize(normal_0 * b0 + normal_1 * b1 + normal_2 * b2);
            float3 pixel_normal = normalize(normal_source.SampleLevel(ss, pixel_uv, mip_level).xyz);
            target[int2(x, y)]  = float4(
                float3_splat(max(0.0f, dot(pixel_normal, normalize(float3_splat(1.0f))))), 1.0f);
          }
        }
      }
      //// Increment edge functions
      // ef0 += n0.x;
      // ef1 += n1.x;
      // ef2 += n2.x;
    }
  }
#endif
  return num_samples;
}

// Returns the number of visible pixels
u32 gi_rasterize_quad(RWTexture2D<float4> target, Texture2D<float4> src_pos,
                      Texture2D<float4> src_normal, float2 uv0, float uv_size,
                      float4x4 obj_to_clip) {
  // Target resolution
  uint width, height;
  target.GetDimensions(width, height);

  // Resolution of the source images
  u32 src_res;
  {
    uint width, height;
    src_pos.GetDimensions(width, height);
    src_res = width;
  }
  f32 mip_level = log2(1.0f + uv_size * f32(src_res));

  u32 num_samples = 0;

  float2 qsuv00 = uv0 + float2(0.0f, 0.0f);
  float2 qsuv01 = uv0 + float2(0.0f, uv_size);
  float2 qsuv10 = uv0 + float2(uv_size, 0.0f);
  float2 qsuv11 = uv0 + float2(uv_size, uv_size);

  float4 pp00 = position_source.SampleLevel(ss, qsuv00, mip_level).xyzw;
  float4 pp01 = position_source.SampleLevel(ss, qsuv01, mip_level).xyzw;
  float4 pp10 = position_source.SampleLevel(ss, qsuv10, mip_level).xyzw;
  float4 pp11 = position_source.SampleLevel(ss, qsuv11, mip_level).xyzw;

  // float3 normal_00 = src_normal.SampleLevel(ss, qsuv00, mip_level).xyz;
  // float3 normal_01 = src_normal.SampleLevel(ss, qsuv01, mip_level).xyz;
  // float3 normal_10 = src_normal.SampleLevel(ss, qsuv10, mip_level).xyz;
  // float3 normal_11 = src_normal.SampleLevel(ss, qsuv11, mip_level).xyz;
  pp00 = mul(obj_to_clip, float4(pp00.xyz, 1.0));
  pp01 = mul(obj_to_clip, float4(pp01.xyz, 1.0));
  pp10 = mul(obj_to_clip, float4(pp10.xyz, 1.0));
  pp11 = mul(obj_to_clip, float4(pp11.xyz, 1.0));

  // For simplicity just discard triangles that touch the boundary
  // @TODO(aschrein): Add proper clipping.
  bool tri_is_valid_0 = in_bounds(pp00) && in_bounds(pp01) && in_bounds(pp10);
  bool tri_is_valid_1 = in_bounds(pp01) && in_bounds(pp10) && in_bounds(pp11);

  pp00.xyz /= pp00.w;
  pp01.xyz /= pp01.w;
  pp10.xyz /= pp10.w;
  pp11.xyz /= pp11.w;

  //
  // For simplicity, we assume samples are at pixel centers
  //  __________
  // |          |
  // |          |
  // |    X     |
  // |          |
  // |__________|
  //

  // Vertices scaled to window size so 1.5 is inside the second pixel
  pp00.xy = float2(float(width) * (pp00.x + 1.0) / 2.0, float(height) * (-pp00.y + 1.0) / 2.0);
  pp01.xy = float2(float(width) * (pp01.x + 1.0) / 2.0, float(height) * (-pp01.y + 1.0) / 2.0);
  pp10.xy = float2(float(width) * (pp10.x + 1.0) / 2.0, float(height) * (-pp10.y + 1.0) / 2.0);
  pp11.xy = float2(float(width) * (pp11.x + 1.0) / 2.0, float(height) * (-pp11.y + 1.0) / 2.0);

#define RASTERIZE_TRIANGE                                                                          \
  Vertex vtx0;                                                                                     \
  Vertex vtx1;                                                                                     \
  Vertex vtx2;                                                                                     \
  vtx0.v  = cur_v0;                                                                                \
  vtx1.v  = cur_v1;                                                                                \
  vtx2.v  = cur_v2;                                                                                \
  vtx0.uv = suv0;                                                                                  \
  vtx1.uv = suv1;                                                                                  \
  vtx2.uv = suv2;                                                                                  \
  num_samples += rasterize_triangle(target, vtx0, vtx1, vtx2, mip_level);

  //vtx0.normal = cur_normal_0;                                                                      \
  //vtx1.normal = cur_normal_1;                                                                      \
  //vtx2.normal = cur_normal_2;                                                                      \

  if (tri_is_valid_0) {
#ifdef GI_ORDER_CW
    float2 suv0   = qsuv00;
    float2 suv1   = qsuv01;
    float2 suv2   = qsuv10;
    float4 cur_v0 = pp00;
    float4 cur_v1 = pp01;
    float4 cur_v2 = pp10;
    // float3 cur_normal_0 = normal_00;
    // float3 cur_normal_1 = normal_01;
    // float3 cur_normal_2 = normal_10;
#else
    float2 suv0   = qsuv00;
    float2 suv1   = qsuv10;
    float2 suv2   = qsuv01;
    float4 cur_v0 = pp00;
    float4 cur_v1 = pp10;
    float4 cur_v2 = pp01;
    // float3 cur_normal_0 = normal_00;
    // float3 cur_normal_1 = normal_10;
    // float3 cur_normal_2 = normal_01;
#endif

    RASTERIZE_TRIANGE
  }
  if (tri_is_valid_1) {
#ifdef GI_ORDER_CW
    float2 suv0   = qsuv10;
    float2 suv1   = qsuv01;
    float2 suv2   = qsuv11;
    float4 cur_v0 = pp10;
    float4 cur_v1 = pp01;
    float4 cur_v2 = pp11;
    // float3 cur_normal_0 = normal_10;
    // float3 cur_normal_1 = normal_01;
    // float3 cur_normal_2 = normal_11;
#else
    float2 suv0   = qsuv10;
    float2 suv1   = qsuv11;
    float2 suv2   = qsuv01;
    float4 cur_v0 = pp10;
    float4 cur_v1 = pp11;
    float4 cur_v2 = pp01;
    // float3 cur_normal_0 = normal_10;
    // float3 cur_normal_1 = normal_11;
    // float3 cur_normal_2 = normal_01;
#endif

    RASTERIZE_TRIANGE
  }
  return num_samples;
}

[numthreads(GI_RASTERIZATION_GROUP_SIZE, GI_RASTERIZATION_GROUP_SIZE, 1)] //
    void
    main(uint3 tid
                      : SV_DispatchThreadID) {
      u32 cell_x = pc.cell_x;
      u32 cell_y = pc.cell_y;

      u32 cell_res;
      {
        IndirectArgs args = indirect_arg_buffer.Load<IndirectArgs>(
            12 * (pc.cell_x + pc.cell_y * COUNTER_GRID_RESOLUTION));
        cell_res = args.dimx;
      }
      if (cell_res == 0) return;
      float2 cell_uv = float2(cell_x, cell_y) / float(COUNTER_GRID_RESOLUTION);

      u32 subcell_x = tid.x;
      u32 subcell_y = tid.y;
      f32 subcell_uv_step =
          1.0f / float(cell_res * GI_RASTERIZATION_GROUP_SIZE * COUNTER_GRID_RESOLUTION);
      float2 subcell_uv = cell_uv + float2(subcell_x, subcell_y) * subcell_uv_step;
      u32 num_samples = gi_rasterize_quad(normal_target, position_source, normal_source, subcell_uv,
                                          subcell_uv_step, mul(fc.viewproj, pc.model));
      add_sample(subcell_uv + float2(subcell_uv_step, subcell_uv_step) / 2.0f, num_samples / 2);
    }
`
    );
  }

  onChange(newValue) {
    this.text = newValue;
    this.compile();
  }

  onResize() {
    this.refs.editor.editor.resize();
  }

  save() {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
      console.log(xhr.responseText);
      let json = JSON.parse(xhr.responseText);
      if ("token" in json) {
        this.token = json["token"];
        // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript?page=1&tab=votes#tab-top
        function copyTextToClipboard(text) {
          var textArea = document.createElement("textarea");
          textArea.style.position = 'fixed';
          textArea.style.top = 0;
          textArea.style.left = 0;
          textArea.style.width = '2em';
          textArea.style.height = '2em';
          textArea.style.padding = 0;
          textArea.style.border = 'none';
          textArea.style.outline = 'none';
          textArea.style.boxShadow = 'none';
          textArea.style.background = 'transparent';
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
          } catch (err) {
            console.log('Oops, unable to copy');
          }

          document.body.removeChild(textArea);
        }
        copyTextToClipboard(this.token);
      }
    })
    xhr.open('POST', 'http://localhost:4000/')
    xhr.send(JSON.stringify({ cmd: "save", text: this.text }))
  }

  compile() {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
      console.log(xhr.responseText);
      let json = JSON.parse(xhr.responseText);
      // global_state.viewer.refs.editor.editor.setValue("");
      let new_spirv = ""
      let new_asm = ""
      if ("stderr" in json)
        new_spirv += json["stderr"];
      if ("spirv" in json)
        new_spirv += json["spirv"];
      if ("asm" in json)
        new_asm += json["asm"];
      if (global_state.spirv_viewer) {
        global_state.spirv_viewer.refs.editor.editor.setValue(new_spirv);
        global_state.spirv_viewer.refs.editor.editor.clearSelection();
      }
      if (global_state.asm_viewer) {
        global_state.asm_viewer.refs.editor.editor.setValue(new_asm);
        global_state.asm_viewer.refs.editor.editor.clearSelection();
      }
    })
    xhr.open('POST', 'http://localhost:4000/')
    xhr.send(JSON.stringify({ cmd: "compile", text: this.text }))
    // window.console.log(this.text);
  }

  load() {
    console.log("LOAD!");
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
      console.log(xhr.responseText);
      let json = JSON.parse(xhr.responseText);
      if ("text" in json)
        this.refs.editor.editor.setValue(json["text"]);

    })
    xhr.open('POST', 'http://localhost:4000/')
    xhr.send(JSON.stringify({ cmd: "load", token: this.token }))

  }

  render() {

    return (
      <div className="ace_editor_container">
        <Button variant="primary" onClick={() => this.compile()}>
          Compile
        </Button>
        <Button variant="primary" onClick={() => this.save()}>
          Save
        </Button>
        <FormControl ref="token" type="text" placeholder="Token" onChange={e => { this.token = e.target.value; }} />
        <Button variant="primary" onClick={() => this.load()}>
          Load
        </Button>
        <div id="teditor_gui_container">
        </div>
        <AceEditor
          value={this.text}
          ref="editor"
          mode="hlsl"
          theme="tomorrow_night_eighties"
          onChange={this.onChange}
          tabSize='2'
          useSoftTabs='true'
          name="UNIQUE_ID_OF_DIV"
          editorProps={{
            $blockScrolling: true
          }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          height="calc(100% - 100px)"
          width="calc(100%)"
        />
      </div>
    );
  }
}

class SPIRVComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.text = "";
    global_state.spirv_viewer = this;
  }

  componentDidMount() {
    this.props.glContainer.on('resize', this.onResize);
  }

  onChange(newValue) {
    this.text = newValue;
  }

  onResize() {
    this.refs.editor.editor.resize();
  }

  render() {

    return (
      <div className="ace_editor_container">
        <div id="teditor_gui_container">
        </div>
        <AceEditor
          value={this.text}
          ref="editor"
          mode="assembly_x86"
          theme="vibrant_ink"
          onChange={this.onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{
            $blockScrolling: true
          }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          height="calc(100% - 100px)"
          width="calc(100%)"
        />
      </div>
    );
  }
}
class ASMComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.text = "";
    global_state.asm_viewer = this;
  }

  componentDidMount() {
    this.props.glContainer.on('resize', this.onResize);
  }

  onChange(newValue) {
    this.text = newValue;
  }

  onResize() {
    this.refs.editor.editor.resize();
  }

  render() {

    return (
      <div className="ace_editor_container">
        <div id="teditor_gui_container">
        </div>
        <AceEditor
          value={this.text}
          ref="editor"
          mode="assembly_x86"
          theme="vibrant_ink"
          onChange={this.onChange}
          tabSize='2'
          useSoftTabs='true'
          name="UNIQUE_ID_OF_DIV"
          editorProps={{
            $blockScrolling: true
          }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          height="calc(100% - 100px)"
          width="calc(100%)"
        />
      </div>
    );
  }
}
class GoldenLayoutWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {
    this.globals = {};
    // Build basic golden-layout config
    const config = {
      content: [{
        type: 'row',
        content: [
          {
            type: 'column',
            content: [
              {
                type: 'react-component',
                isClosable: false,
                component: 'TextEditor',
                title: 'Text Editor',

                props: { globals: () => this.globals }


              }
            ]
          },
          {
            type: 'column',
            content: [
              {
                type: 'react-component',
                isClosable: false,
                component: 'ASM',
                title: 'ASM',

                props: { globals: () => this.globals }


              },
              {
                type: 'react-component',
                isClosable: false,
                component: 'SPIRV',
                title: 'SPIRV',

                props: { globals: () => this.globals }


              }
            ]
          }
        ]
      }]
    };

    var layout = new GoldenLayout(config, this.layout);
    this.layout = layout;
    layout.registerComponent('TextEditor',
      TextEditorComponent
    );
    layout.registerComponent('SPIRV',
      SPIRVComponent
    );
    layout.registerComponent('ASM',
      ASMComponent
    );
    layout.init();
    window.React = React;
    window.ReactDOM = ReactDOM;
    window.addEventListener('resize', () => {
      layout.updateSize();
    });

  }

  render() {

    return (
      <div className='goldenLayout'
        ref={input => this.layout = input} >
      </div>
    );
  }
}


export default GoldenLayoutWrapper;