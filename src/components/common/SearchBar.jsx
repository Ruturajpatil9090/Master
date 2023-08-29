import React from "react";
import TextField from "@mui/material/TextField";

function SearchBar({ value, onChange,onSearchClick }) {
  return (
    <div className="controls">
      <TextField
        id="search"
        label="Search by Title"
        variant="outlined"
        value={value}
        onChange={onChange}
        placeholder="Enter title..."
        onClick={onSearchClick} 
        style={{"float":"right"}}
      />
    </div>
  );
}

export default SearchBar;

