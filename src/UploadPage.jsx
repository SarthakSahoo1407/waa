import React from "react";
import { useHistory } from "react-router-dom";

function UploadPage() {
  const history = useHistory();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      // Navigate to App component
      history.push("/app");
    } else {
      alert("Please upload a CSV file.");
    }
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default UploadPage;
