export const semanticAnalysis = (fileContent, setAnalysisResult, setIsSemanticAnalyzed) => {
  const keywords = ["int", "String", "boolean", "float", "double", "char"];
  const assignmentOperator = "=";
  const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  const lines = fileContent?.split("\n") || [];
  const declaredVariables = new Set();
  const variableAssignments = new Set();

  let allValid = true;
  let errorReason = "";

  const isValidTypeAssignment = (type, value) => {
    switch (type) {
      case "int":
        return !isNaN(value) && value.indexOf('.') === -1;
      case "String":
        return typeof value === "string" && value.startsWith('"') && value.endsWith('"');
      case "boolean":
        return value === "true" || value === "false";
      case "float":
        if (typeof value === "string" && value.includes('f') || value.includes('F')) {
             const numberPart = value.replace(/[fF]$/, '');
          return !isNaN(numberPart) && numberPart.indexOf('.') !== -1;
        }
        return !isNaN(value) && value.indexOf('.') !== -1;
      case "double":
        return !isNaN(value) && value.indexOf('.') !== -1;
      case "char":
        return typeof value === "string" && value.length === 3 && value[0] === "'" && value[2] === "'";
      default:
        return false;
    }
  };
  
  
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

    if (declaredVariables.has(identifier)) {
      return `Variable '${identifier}' has already been declared.`;
    }

    declaredVariables.add(identifier);

    if (tokens[2] === assignmentOperator) {
      if (tokens.length < 5) {
        return `Incomplete assignment after '${identifier}'`;
      }

      const value = tokens[3];
      if (!isValidTypeAssignment(type, value)) {
        return `Invalid assignment: '${value}' is not a valid value for type '${type}'`;
      }

      const semicolon = tokens[4];
      if (semicolon !== ";") {
        return "Missing or misplaced semicolon after assignment";
      }

      variableAssignments.add(identifier);
    } else if (tokens[2] === ";") {
      return null;
    } else {
      return `Unexpected token '${tokens[2]}' after identifier`;
    }

    return null;
  };

  const validateUsage = (tokens) => {
    const identifier = tokens[0];
    if (!declaredVariables.has(identifier)) {
      return `Variable '${identifier}' is used but not declared.`;
    }

    // Ensure variable assignments are valid
    if (tokens[1] === assignmentOperator) {
      const value = tokens[2];
      if (!isValidTypeAssignment(declaredVariables.get(identifier), value)) {
        return `Invalid assignment: '${value}' for variable '${identifier}'`;
      }
    }

    return null;
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;

    const tokens = trimmedLine
      .split(/(\s+|;|=)/)
      .filter((token) => token.trim() !== "");

    if (tokens[0] === "int" || tokens[0] === "String" || tokens[0] === "boolean" || tokens[0] === "float" || tokens[0] === "double" || tokens[0] === "char") {
      const error = validateDeclaration(tokens);
      if (error) {
        allValid = false;
        errorReason = error;
        break;
      }
    } else {
      const error = validateUsage(tokens);
      if (error) {
        allValid = false;
        errorReason = error;
        break;
      }
    }
  }


  if (allValid) {
    setAnalysisResult("Semantic analysis passed.");
    setIsSemanticAnalyzed(true);
  } else {
    setAnalysisResult(`Semantic analysis failed. Error: ${errorReason}`);
  }
};
