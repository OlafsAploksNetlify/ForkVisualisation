const code = `if (fork() && !fork()) {
  if (fork() && fork()) {
    print(1);
  }
} else if ((!fork() || fork()) && fork()) {
  print(2);
} else {
  print(3);
}
print(5)
if ((fork() && (fork() || fork())) || ((fork() || fork()) && fork())){}
print("6")
if (!(fork() && !fork())){}elseif(){}
`;

class Parser {
  constructor(code) {
    this.code = code;
  }

  getBracketContent(code, type, padding = 0) {
    if (code[padding] !== type[0]) {
      return null;
    }
    let brackets = 0;
    let found;
    let start = null;
    const regex = RegExp(`[\\${type[0]}\\${type[1]}]`,'g');
    while ((found = regex.exec(code)) !== null) {
      if (found[0] === type[0]) {
        if (start === null) {
          start = regex.lastIndex;
        }
        brackets++;
      } else if (found[0] === type[1]) {
        brackets--;
        if (brackets === 0) {
          return {
            start: start - 1,
            end: regex.lastIndex - 1,
            content: code.slice(start, regex.lastIndex-1),
          };
        }
      }
    }
    return null;
  }

  parseCondition(fullCondition) {
    const self = this;

    function parseOr(condition) {
      const r = [];
      let lastBlockStart = 0;
      let brackets = 0;
      for (let i = 0; i < condition.length; ++i) {
        if (condition[i] === '(') {
          brackets++;
        } else if (condition[i] === ')') {
          brackets--;
        } else if (condition.slice(i, i+2) === '||' && brackets === 0) {
          r.push(self.parseCondition(condition.slice(lastBlockStart, i)));
          lastBlockStart = i + 2;
        }
      }

      if (r.length > 0) {
        r.push(self.parseCondition(condition.slice(lastBlockStart)));
        return {
          rawCondition: condition,
          type: 'or',
          value: r,
        };
      } else {
        return parseAnd(condition);
      }
    }

    function parseAnd(condition) {
      const r = [];
      let lastBlockStart = 0;
      let brackets = 0;
      for (let i = 0; i < condition.length; ++i) {
        if (condition[i] === '(') {
          brackets++;
        } else if (condition[i] === ')') {
          brackets--;
        } else if (condition.slice(i, i+2) === '&&' && brackets === 0) {
          r.push(self.parseCondition(condition.slice(lastBlockStart, i)));
          lastBlockStart = i + 2;
        }
      }

      if (r.length > 0) {
        r.push(self.parseCondition(condition.slice(lastBlockStart)));
        return {
          rawCondition: condition,
          type: 'and',
          value: r,
        };
      } else {
        if (condition[0] === '!') {
          return {
            rawCondition: condition,
            type: 'not',
            value: self.parseCondition(condition.slice(1)),
          }
        } else if (condition === 'fork()') {
          return {
            rawCondition: condition,
            type: 'fork',
          };
        } else {
          throw new Parser.Exception(`Unknown condition ${condition}`);
        }
      }
    }


    if (!fullCondition) return null;

    while (true) {
      const outerBrackets = this.getBracketContent(fullCondition, '()');
      if (outerBrackets && outerBrackets.content.length === fullCondition.length - 2) {
        fullCondition = outerBrackets.content;
      } else {
        break;
      }
    }

    return parseOr(fullCondition);
  }

  getIfStatementLength(code) {
    let braces = 0;
    let found;
    const bracesRegex = RegExp('({|})','g');
    while ((found = bracesRegex.exec(code)) !== null) {
      if (found[0] === '{') {
        braces++;
      } else if (found[0] === '}') {
        braces--;
      }
      if (braces === 0 && code.indexOf("else", bracesRegex.lastIndex) !== bracesRegex.lastIndex) {
        return bracesRegex.lastIndex;
      }
    }
    throw new Parser.Exception("Incorrect IF condition (1)");
  }

  parseIf(code) {
    const branches = [];
    while (code.length) {
      let condition = null;
      if (code.indexOf("if") === 0) {
        condition = this.getBracketContent(code, '()', 2);
      } else if (code.indexOf("elseif") === 0) {
        condition = this.getBracketContent(code, '()', 6);
      } else if (code.indexOf("else") === 0) {
        condition = {
          content: null,
          end: 3,
        };
      }

      if (!condition) {
        throw new Parser.Exception("Incorrect IF conditions (2)");
      }

      let content = this.getBracketContent(code, '{}', condition.end + 1);

      branches.push({
        type: 'branch',
        condition: this.parseCondition(condition.content),
        code: this.parseCode(content.content),
      });

      code = code.slice(content.end + 1);

    }

    return branches;
  }

  parseFunction(code) {
    if (code.length === 0) {
      return {
        type: 'skip',
      }
    }

    const fn = code.match(/^(\w+)\(/);
    if (!fn) {
      throw new Parser.Exception("Incorrectly formatted code (1)");
    }

    if (fn[1] === "print") {
      const argument = this.getBracketContent(code, '()', 5);
      if (!argument) {
        throw new Parser.Exception("Incorrectly formatted code (2)");
      }

      return {
        rawCode: code.slice(0, argument.end + 1),
        type: 'print',
        value: argument.content,
      };
    } else {
      throw new Parser.Exception(`Unknown function ${fn[1]}`);
    }
  }

  parseCode(code) {
    if (code.length === 0) {
      return [];
    }

    if (code.indexOf("if") === 0) {
      const length = this.getIfStatementLength(code);
      const ifCode = code.slice(0, length);
      const branches = this.parseIf(ifCode);
      const parsed = {
        rawCode: ifCode,
        type: 'if',
        value: branches,
      };

      return [parsed].concat(this.parseCode(code.slice(parsed.rawCode.length)));
    } else {
      const parsed = this.parseFunction(code);
      return [parsed].concat(this.parseCode(code.slice(parsed.rawCode.length)));
    }
  }

  parse() {
    const pureCode = this.code.replace(/(\s+|;)/g, "");
    return this.parseCode(pureCode);
  }

  static parse(code) {
    const parser = new Parser(code);
    let result = null;
    return parser.parse();
  }
};

Parser.Exception = class ParserException {
  constructor(error) {
    this.error = error;
  }

  toString() {
    return this.error;
  }
};

export default Parser;
