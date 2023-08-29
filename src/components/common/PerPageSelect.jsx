import React from "react";
import Form from 'react-bootstrap/Form';

function PerPageSelect({ value, onChange }) {
  const options = [15, 25, 50, 100];

//1. const options = [15, 25, 50, 100];: Defines an array of available options for posts per page.

  return (
    <div className="controls">
      <Form.Group className="mb-3" style={{ float: "left", marginLeft: "150px" }}>
        <Form.Label id="perPage-label">Posts per page</Form.Label>
        <Form.Select
          aria-label="Posts per page"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>

//2.The {options.map(...) => block iterates over the options array to create a set of option elements for the dropdown. 
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
}

export default PerPageSelect;



