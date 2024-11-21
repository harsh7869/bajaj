import React from 'react';
import './App.css';
import {useState} from 'react';
import axios from 'axios';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [responseData, setResponseData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Handle JSON input change
  const handleInputChange = (event) => {
    setJsonData(event.target.value);
  };

  // Handle dropdown selection
  const handleSelectChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedOptions(selected);
  };

  // Handle form submission
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     // console.log(response.jsonData);
  //     // Parse JSON input to validate
  //     const data = JSON.parse(jsonData);
      
  //     // Make a POST request to your backend API endpoint
  //     const response = await axios.post('https://bajaj-c8ox.onrender.com/bfhl', { data });

  //     setResponseData(response.data);
  //     setError(''); // Clear any previous errors
  //   } catch (err) {
  //     setError('Invalid JSON input or server error');
  //   }
  // };




  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const parsedData = JSON.parse(jsonData); // Parse JSON input to validate
  //     const payload = {
  //       data: parsedData.data, // Use `parsedData` instead of `data` directly
  //       file_b64: parsedData.file_b64
  //     };
      
  //     // Make a POST request to your backend API endpoint
  //     const response = await axios.post('https://bajaj-c8ox.onrender.com/bfhl', payload);

  //     setResponseData(response.data);
  //     setError(''); // Clear any previous errors
  //   } catch (err) {
  //     setError('Invalid JSON input or server error');
  //   }
  // };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // Parse JSON input to validate and ensure data is an array
        const parsedData = JSON.parse(jsonData);
        
        if (!Array.isArray(parsedData.data)) {
            throw new Error("The 'data' field should be an array");
        }

        const payload = {
            data: parsedData.data, // Ensure data is an array, not a string
            file_b64: parsedData.file_b64 // Pass the Base64 encoded file string
        };

        // Make a POST request using fetch to your backend API endpoint
        const response = await fetch('https://bajaj-c8ox.onrender.com/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData);
        setResponseData(responseData); // Update state with response data
        setError(''); // Clear any previous errors
    } catch (err) {
        setError('Invalid JSON input or server error');
    }
};



  // Filtered Response Rendering
  const renderFilteredResponse = () => {
    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    const displayData = {};

    if (selectedOptions.includes('Numbers')) displayData.numbers = numbers;
    if (selectedOptions.includes('Alphabets')) displayData.alphabets = alphabets;
    if (selectedOptions.includes('Highest Lowercase Alphabet')) displayData.highest_lowercase_alphabet = highest_lowercase_alphabet;

    return JSON.stringify(displayData, null, 2);
  };

  return (
    <div className="App">
      <h1>{process.env.REACT_APP_ROLL_NUMBER}</h1> {/* Set your roll number in .env file */}

      <form onSubmit={handleSubmit}>
        <label>
          Enter JSON Data:
          <input type="text" value={jsonData} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>

      

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {Object.keys(responseData).length > 0 && (
        <div>
          <label>Select Options:</label>
          <select multiple={true} onChange={handleSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          <h2>Filtered Response:</h2>
          <pre>{renderFilteredResponse()}</pre>
        </div>
      )}
    </div>
  );
}

export default App;