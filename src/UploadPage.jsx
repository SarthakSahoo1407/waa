// UploadPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    const data = {
      selectedFeatures,
      selectedTargets
    };
    console.log(JSON.stringify(data));
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Upload Page</h1>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <div>
          <h3>Features:</h3>
          {headers.map((header, index) => (
            <label key={index} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={header}
                checked={selectedFeatures.includes(header)}
                onChange={handleFeatureChange}
                style={styles.checkbox}
              />
              {header}
            </label>
          ))}
        </div>
        <div>
          <h3>Targets:</h3>
          {headers.map((header, index) => (
            <label key={index} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={header}
                checked={selectedTargets.includes(header)}
                onChange={handleTargetChange}
                disabled={selectedFeatures.includes(header)}
                style={styles.checkbox}
              />
              {header}
            </label>
          ))}
        </div>
        <Link to="/app" style={styles.link}>
          <button style={styles.button} onClick={handleGoToSecondPage}>
            Go to Second Page
          </button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  content: {
    textAlign: 'center',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  fileInput: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginLeft: '10px',
  },
};

export default UploadPage;
