// // UploadPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// require('dotenv').config();

function UploadPage() {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedTargets, setSelectedTargets] = useState([]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      const lines = result.split('\n');
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(header => header.trim());
        setHeaders(headers);
        setSelectedFeatures([headers[0]]); // Set default selected features
        setSelectedTargets([headers[0]]); // Set default selected targets
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleFeatureChange = (event) => {
    const feature = event.target.value;
    setSelectedFeatures(prevSelected => {
      if (prevSelected.includes(feature)) {
        return prevSelected.filter(item => item !== feature);
      } else {
        return [...prevSelected, feature];
      }
    });
  };

  const handleTargetChange = (event) => {
    const target = event.target.value;
    setSelectedTargets(prevSelected => {
      if (prevSelected.includes(target)) {
        return prevSelected.filter(item => item !== target);
      } else {
        return [...prevSelected, target];
      }
    });
  };

  const handleGoToSecondPage = () => {
    console.log()
    const data = {
      selectedFeatures,
      selectedTargets
    };
    console.log(JSON.stringify(data));
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("features", selectedFeatures.join(","));
    formData.append("targets", selectedTargets.join(","));
    formData.append("file", file);

    fetch("http://10.130.0.248:8000/api/file", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        // Redirect to the second page or handle response as needed
      })
      .catch((error) => {
        console.error("There was a problem with the API request:", error);
      });
  };
  return (
    <div className="flex">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">Upload Page</h1>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-4 p-4 border border-gray-300 rounded"
          />
          <div className="flex flex-row mb-4">
            <div className="mr-8">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Features:</h3>
              {headers.map((header, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    id={`feature-checkbox-${index}`}
                    type="checkbox"
                    value={header}
                    checked={selectedFeatures.includes(header)}
                    onChange={handleFeatureChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`feature-checkbox-${index}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {header}
                  </label>
                </div>
              ))}
            </div>
  
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Targets:</h3>
              {headers.map((header, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    id={`target-checkbox-${index}`}
                    type="checkbox"
                    value={header}
                    checked={selectedTargets.includes(header)}
                    onChange={handleTargetChange}
                    disabled={selectedFeatures.includes(header)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`target-checkbox-${index}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {header}
                  </label>
                </div>
              ))}
            </div>
          </div>
  
          <Link to="/app" className="text-white">
            <button
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={handleGoToSecondPage}
            >
              HyperParameters
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default UploadPage;
