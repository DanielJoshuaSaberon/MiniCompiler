export const lexicalAnalysis = (fileContent, setAnalysisResult, setIsLexicalAnalyzed) => {
  const keywords = ["int", "String", "boolean", "float", "double", "char", "if", "else", "return", "true", "false"];
  const operators = ["=", "==", "!=", "<", ">", "<=", ">=", "+", "-", "*", "/"];
  const punctuators = ["(", ")", "{", "}", ";"];

  const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const integerPattern = /^[0-9]+$/;
  const floatPattern = /^[0-9]*\.[0-9]{1,7}$/;
  const doublePattern = /^[0-9]*\.[0-9]{1,15}$/;
  const stringPattern = /^"[^"]*"$/;
  const charPattern = /^'[^']{1}'$/;

  const lines = fileContent?.split("\n") || [];
  let allValid = true;
  let errorReason = "";

  const states = {
    START: "START",
    KEYWORD: "KEYWORD",
    OPERATOR: "OPERATOR",
    IDENTIFIER: "IDENTIFIER",
    INTEGER: "INTEGER",
    FLOAT: "FLOAT",
    DOUBLE: "DOUBLE", 
    STRING: "STRING",
    CHAR: "CHAR",
    PUNCTUATOR: "PUNCTUATOR",
    ERROR: "ERROR",
  };

  let currentState = states.START;

  const processToken = (token) => {
    if (keywords.includes(token)) {
      currentState = states.KEYWORD;
      return true;
    }
    if (operators.includes(token)) {
      currentState = states.OPERATOR;
      return true;
    }
    if (punctuators.includes(token)) {
      currentState = states.PUNCTUATOR;
      return true;
    }
    if (integerPattern.test(token)) {
      currentState = states.INTEGER;
      return true;
    }
    if (floatPattern.test(token)) {
      currentState = states.FLOAT;
      return true;
    }
    if (doublePattern.test(token)) { 
      currentState = states.DOUBLE;
      return true;
    }
    if (stringPattern.test(token)) {
      currentState = states.STRING;
      return true;
    }
    if (charPattern.test(token)) {
      currentState = states.CHAR;
      return true;
    }
    if (identifierPattern.test(token)) {
      currentState = states.IDENTIFIER;
      return true;
    }
    currentState = states.ERROR;
    return false;
  };

  const validateAssignmentValue = (keyword, value) => {
    switch (keyword) {
      case "int":
        return integerPattern.test(value);
      case "String":
        return stringPattern.test(value);
      case "boolean":
        return value === "true" || value === "false";
      case "float":
        return floatPattern.test(value);
      case "double": 
        return doublePattern.test(value);
      case "char":
        return charPattern.test(value);
      default:
        return false;
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;

    const tokens = trimmedLine
      .split(/(\s+|;|\{|\}|\(|\)|\+|\-|\*|\/|==|!=|<=|>=|\=)/)
      .filter((token) => token.trim() !== "");

    let currentKeyword = "";

    for (const token of tokens) {
      if (keywords.includes(token)) {
        currentKeyword = token;
        if (!processToken(token)) {
          allValid = false;
          errorReason = `Invalid keyword: ${token}`;
          break;
        }
      }

      if (currentKeyword && token === "=") {
        const nextToken = tokens[tokens.indexOf(token) + 1];
        if (!validateAssignmentValue(currentKeyword, nextToken)) {
          allValid = false;
          errorReason = `Invalid value for ${currentKeyword}: ${nextToken}`;
          break;
        }
      }

      if (!processToken(token)) {
        allValid = false;
        errorReason = `Invalid token: ${token}`;
        break;
      }
    }

    if (!allValid) break;
  }

  if (allValid) {
    setAnalysisResult("Lexical analysis passed.");
    setIsLexicalAnalyzed(true);
  } else {
    setAnalysisResult(`Lexical analysis failed. Error: ${errorReason}`);
  }
};
//Final Working Code --Sab