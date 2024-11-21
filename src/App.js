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
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Parse JSON input to validate
      const data = JSON.parse(jsonData);
      
      // Make a POST request to your backend API endpoint
      const response = await axios.post('https://http://localhost:5000/bfhl', { data });

      setResponseData(response.data);
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