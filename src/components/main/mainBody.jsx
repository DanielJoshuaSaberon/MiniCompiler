import { useState } from "react";
import { Button } from "../ui/button";
import { handleFileUpload } from "../modules/fileHandlers";
import { lexicalAnalysis } from "../modules/lexicalAnalysis";
import { resetAnalysis } from "../modules/resetFunction";

const MainBody = () => {
  const [fileContent, setFileContent] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLexicalAnalyzed, setIsLexicalAnalyzed] = useState(false);

  const handleButtonClick = () => document.getElementById("file-upload")?.click();

  const handleClear = () => {
    resetAnalysis(setFileContent, setIsFileUploaded, setAnalysisResult, setIsLexicalAnalyzed);
    setIsFileUploaded(false);
  };

 
  const formatFileContent = (content) => {
    return content.split("\n").map((line) => (
      <p key={line}>{line}</p>
    ));
  };

  return (
    <div className="m-auto">
      <div className="flex gap-5">
        <Button variant="main" size="sm" onClick={handleButtonClick}  disabled={isFileUploaded}>Upload File</Button>
        <input
          type="file"
          accept=".txt,.java"
          onChange={(e) => handleFileUpload(e, setFileContent, setIsFileUploaded)}
          className="hidden"
          id="file-upload"
        />

        <Button
          variant="main"
          size="sm"
          disabled={!isFileUploaded}
          onClick={() => lexicalAnalysis(fileContent, setAnalysisResult, setIsLexicalAnalyzed)}
        >
          Lexical Analysis
        </Button>

        <Button variant="main" size="sm" disabled={!isLexicalAnalyzed}>Syntax Analysis</Button>
        <Button variant="main" size="sm" disabled={true}>Semantic Analysis</Button>
        <Button variant="destructive" size="sm" disabled={!isFileUploaded} onClick={handleClear}>
          CLEAR
        </Button>
      </div>

      
      <div className="container3 w-[100%] h-[80px] mt-4 bg-card rounded-lg flex flex-col">
        <h1 className="text-xl font-semibold px-2.5 pt-2.5">RESULT: </h1>
        <p className="text-base font-semibold px-5 py-0.5">
          {analysisResult ? analysisResult : "There is no result yet."}
        </p>
      </div>

      <div className="container3 w-[100%] h-[200px] mt-4 bg-card rounded-lg">
        <div className="text-xl font-semibold px-2.5 pt-2.5">FILE CONTENT: </div>
        <div id="content" className="text-base font-semibold px-5 py-0.5 w-[100%] h-[150px] overflow-auto bg-clip-content">
          {formatFileContent(fileContent)}
        </div>
      </div>
    </div>
  );
};

export default MainBody;
