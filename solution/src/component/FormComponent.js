import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { isNameValid, getLocations } from '../mock-api/apis';
import './../App.css';

function FormComponent() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Canada'); //  Set the first value manually
  const [list, setList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isNameAvailable, setIsNameAvailable] = useState(true); // State to track if the name is available

  useEffect(() => {
    // Fetch locations when the component mounts
    fetchLocations();
  }, []);

  // Function to fetch locations from the API
  const fetchLocations = async () => {
    try {
      const locations = await getLocations();
      setLocations(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Function to clear the input fields
  const handleClear = () => {
    setName('');
    setLocation('Canada');
  };

  // Function to handle adding data to the list
  const handleAddToList = async () => {
    // double check to avoid add an invalid name
    let available = await isNameValid(name);
    setIsNameAvailable(available);
    if (available) {
      setList([...list, { name, location }]);
    }
    // Clear the input fields after adding to the list
    handleClear();
  };

  const manageName = async (name) => {
    setName(name);
    let available = await isNameValid(name);
    setIsNameAvailable(available);
  }

  const renderTableRows = () => {
    const rowsToRender = Math.max(5, list.length);
    const rows = [];
    for (let i = 0; i < rowsToRender; i++) {
      const item = list[i];
      rows.push(
        <tr key={`row_${i}`} style={{ backgroundColor: i % 2 === 0 ? '#f0f8ff' : 'white' }}>
          <td>{item ? item.name : ''}</td>
          <td>{item ? item.location : ''}</td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="container form-component">
      <div className="margin-component">
        <div className="mb-3">
          <div className="inline-content">
            <label htmlFor="name" className="form-label label-field">Name</label>
            <input 
              type="text" 
              className="form-control text-field" 
              id="name" 
              value={name} 
              onChange={(e) => manageName(e.target.value)}
              autoComplete="name"
              required 
            />
          </div>
          {!isNameAvailable && <div className="text-danger">This name is already taken</div>}
        </div>
        <div className="mb-3">
          <div className="inline-content">
            <label htmlFor="location" className="form-label label-field">Location</label>
            <select 
              className="select-field" 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="separator"></div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="button" className="custom-button" onClick={handleClear}>Clear</button>
          <button type="submit" className="custom-button" onClick={handleAddToList}>Add</button>
        </div>
        <div className="mt-4"></div>
        <table className="table.striped custom-table w-100">
          <thead>
            <tr>
              <th className="bg-secondary">Name</th>
              <th className="bg-secondary">Location</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormComponent;
