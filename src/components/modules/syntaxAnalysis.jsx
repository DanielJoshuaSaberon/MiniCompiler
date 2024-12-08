export const syntaxAnalysis = (fileContent, setAnalysisResult, setIsSyntaxAnalyzed) => {
  const keywords = ["int", "String", "boolean", "float", "double", "char"];
  const assignmentOperator = "=";

  const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  const lines = fileContent?.split("\n") || [];
  let allValid = true;
  let errorReason = "";

  const validateDeclaration = (tokens) => {
    if (tokens.length < 3) {
      return `Incomplete declaration: '${tokens.join(" ")}'`;
    }

    const type = tokens[0];
    if (!keywords.includes(type)) {
      return `Invalid type: '${type}'`;
    }

    const identifier = tokens[1];
    if (!identifierPattern.test(identifier)) {
      return `Invalid identifier: '${identifier}'`;
    }

    if (tokens[2] === assignmentOperator) {
      if (tokens.length < 5) {
        return `Incomplete assignment after '${identifier}'`;
      }

      const semicolon = tokens[4];

      if (semicolon !== ";") {
        return "Missing or misplaced semicolon after assignment";
      }
    } else if (tokens[2] === ";") {
      return null;
    } else {
      return `Unexpected token '${tokens[2]}' after identifier`;
    }

    return null;
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;

    const tokens = trimmedLine
      .split(/(\s+|;|=)/) 
      .filter((token) => token.trim() !== "");

    const error = validateDeclaration(tokens);
    if (error) {
      allValid = false;
      errorReason = error;
      break;
    }
  }

  if (allValid) {
    setAnalysisResult("Syntax analysis passed.");
    setIsSyntaxAnalyzed(true);
  } else {
    setAnalysisResult(`Syntax analysis failed. Error: ${errorReason}`);
  }
};
