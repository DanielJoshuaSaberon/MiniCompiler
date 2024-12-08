export const lexicalAnalysis = (fileContent, setAnalysisResult, setIsLexicalAnalyzed) => {
  const keywords = ["int", "String", "boolean", "float", "double", "char"];
  const operators = ["="];
  const punctuators = [";"];

  const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const integerPattern = /^[0-9]+$/;
  const floatPattern = /^[0-9]*\.[0-9]{1,7}[fF]?$/; 
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
  }

  if (allValid) {
    setAnalysisResult("Lexical analysis passed.");
    setIsLexicalAnalyzed(true);
  } else {
    setAnalysisResult(`Lexical analysis failed. Error: ${errorReason}`);
  }
};
