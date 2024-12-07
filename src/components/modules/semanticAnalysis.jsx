export const semanticAnalysis = (fileContent, setAnalysisResult, setIsSemanticAnalyzed) => {
    const keywords = ["int", "String", "boolean", "float", "double", "char"];
    const assignmentOperator = "=";
    
    const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    const integerPattern = /^[0-9]+$/;
    const floatPattern = /^[0-9]*\.[0-9]{1,7}$/;
    const doublePattern = /^[0-9]*\.[0-9]{1,15}$/;
    const stringPattern = /^"[^"]*"$/;
    const charPattern = /^'[^']{1}'$/;
  
    const lines = fileContent?.split("\n") || [];
    
    let allValid = true;
    let errorReason = "";
    
    const declaredVariables = new Set();
  
    const validateAssignmentValue = (type, value) => {
      switch (type) {
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
        return `Duplicate declaration of variable '${identifier}'`;
      } else {
        declaredVariables.add(identifier);
      }
  
      if (tokens[2] === assignmentOperator) {
        if (tokens.length < 5) {
          return `Incomplete assignment after '${identifier}'`;
        }
  
        const value = tokens[3];
        const semicolon = tokens[4];
  
        if (!validateAssignmentValue(type, value)) {
          return `Invalid value '${value}' for type '${type}'`;
        }
  
        if (semicolon !== ";") {
          return `Missing or misplaced semicolon after assignment`;
        }
      } else if (tokens[2] === ";") {
        return null; 
      } else {
        return `Unexpected token '${tokens[2]}' after identifier`;
      }
  
      return null;
    };
 
    const usedVariables = new Set();
  
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
  
      tokens.forEach((token) => {
        if (declaredVariables.has(token) && token !== assignmentOperator && token !== ";") {
          usedVariables.add(token);
        }
      });
    }
  
    for (let variable of declaredVariables) {
      if (!usedVariables.has(variable)) {
        allValid = false;
        errorReason = `Variable '${variable}' is declared but never used.`;
        break;
      }
    }
  
    if (allValid) {
      setAnalysisResult("Semantic analysis passed.");
      setIsSemanticAnalyzed(true);
    } else {
      setAnalysisResult(`Semantic analysis failed. Error: ${errorReason}`);
    }
  };
  