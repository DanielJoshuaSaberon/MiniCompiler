export const handleFileUpload = (event, setFileContent, setIsFileUploaded) => {
  const file = event.target.files?.[0];
  if (file) {
    const fileType = file.name.split(".").pop();
    if (fileType === "txt" || fileType === "java") {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result);
        setIsFileUploaded(true);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt or .java file");
    }
  }
};
