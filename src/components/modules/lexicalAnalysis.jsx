export const lexicalAnalysis = (fileContent, setAnalysisResult, setIsLexicalAnalyzed) => {
  const keywords = ["int", "String", "boolean", "float", "double", "char"];
  const operators = ["="];
  const punctuators = [";"];

  const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const integerPattern = /^[0-9]+$/;
  const floatPattern = /^[0-9]*\.[0-9]{1,7}$/;
  const doublePattern = /^[0-9]*\.[0-9]{1,15}$/;
  const stringPattern = /^"[^"]*"$/;
  const charPattern = /^'[^']{1}'$/;
  const booleanPattern = /^(true|false)$/;

  const lines = fileContent?.split("\n") || [];
  let allValid = true;
  let errorReason = "";

  const validateToken = (token) => {
    if (keywords.includes(token)) return true;
    if (operators.includes(token)) return true;
    if (punctuators.includes(token)) return true;
    if (identifierPattern.test(token)) return true;
    if (integerPattern.test(token)) return true;
    if (floatPattern.test(token)) return true;
    if (doublePattern.test(token)) return true;
    if (stringPattern.test(token)) return true;
    if (charPattern.test(token)) return true;
    if (booleanPattern.test(token)) return true;
    return false;
  };

  const validateDeclarationTokens = (tokens) => {
    if (tokens.length < 3) return `Incomplete declaration: '${tokens.join(" ")}'`;

    const [type, identifier, assignmentOrPunctuator] = tokens;

    if (!keywords.includes(type)) return `Invalid type: '${type}'`;

    if (!identifierPattern.test(identifier)) return `Invalid identifier: '${identifier}'`;

    if (assignmentOrPunctuator === "=") {
      if (tokens.length < 5) return `Incomplete assignment for '${identifier}'`;

      const value = tokens[3];
      const semicolon = tokens[4];

      if (!validateAssignmentValue(type, value)) {
        return `Invalid value '${value}' for type '${type}'`;
      }

      if (semicolon !== ";") return "Missing or misplaced semicolon after assignment";
    } else if (assignmentOrPunctuator === ";") {
      return null;
    } else {
      return `Unexpected token '${assignmentOrPunctuator}' after identifier`;
    }

    return null;
  };

  const validateAssignmentValue = (type, value) => {
    switch (type) {
      case "int":
        return integerPattern.test(value);
      case "String":
        return stringPattern.test(value);
      case "boolean":
        return booleanPattern.test(value);
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
      .split(/(\s+|;|=)/)
      .filter((token) => token.trim() !== "");

    for (const token of tokens) {
      if (!validateToken(token)) {
        allValid = false;
        errorReason = `Invalid token: '${token}'`;
        break;
      }
    }

    if (!allValid) break;

    const error = validateDeclarationTokens(tokens);
    if (error) {
      allValid = false;
      errorReason = error;
      break;
    }
  }

  if (allValid) {
    setAnalysisResult("Lexical analysis passed.");
    setIsLexicalAnalyzed(true);
  } else {
    setAnalysisResult(`Lexical analysis failed. Error: ${errorReason}`);
  }
};
