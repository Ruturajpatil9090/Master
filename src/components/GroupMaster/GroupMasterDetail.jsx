import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Pagination from "../common/Pagination";
import SearchBar from "../common/SearchBar";
import PerPageSelect from "../common/PerPageSelect";
import { getGroupMasterData } from "../../services/groupMasterService";
import "../../App.css";
// we have to import of all our necesary files and externals files.

function GroupMasterDetail() {
  const [fetchedData, setFetchedData] = useState([]); // Store fetched data once
  const [filteredData, setFilteredData] = useState([]); // Store filtered data
  const [perPage, setPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getGroupMasterData(searchTerm, filterValue);
      //console.log(response)
      setFetchedData(response.data); // Store fetched data once by using the SetFetchData set values in useState
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

//fetchPosts is an asynchronous function that attempts to fetch data using the getGroupMasterData service. 

useEffect(() => {
  // Filter data based on search term and filter value
  const filtered = fetchedData.filter(
    (post) =>
      post.group_Type === filterValue ||
      (filterValue === "" &&
        post.group_Name_E.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  setFilteredData(filtered);
  // Reset current page when search term or filter value changes
  setCurrentPage(1);
}, [searchTerm, filterValue, fetchedData]);

//fetchedData is an array of posts or items that need to be filtered.
// **The filtering logic consists of two conditions =>
//   1.The first condition checks if the group_Type property of a post matches the filterValue. 
//   2.group_Name_E property of a post includes the lowercase of searchTerm ,If both conditions are true, the post is included in the filtered array.

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
    setCurrentPage(1);
  };
  
  //These are event handler functions that update the state variable perPage based on user input.

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //These are event handler functions that update the state variable searchTerm based on user input.

  const pageCount = Math.ceil(filteredData.length / perPage);

  const paginatedPosts = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

// Calculates the total number of pages (pageCount) based on the length of the filtered data and the number of items per page. 
//Additionally, it calculates the subset of filteredData that should be displayed on the current page.



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //handlePageChange updates the currentPage when the user changes pages.

  const handleClick = () => {
    navigate("/add");
  };
  //handleClick navigates the user to the "/add" route when a button is clicked.

  const handleRowClick = (group_Code) => {
    navigate("/add", { state: { editRecordCode: group_Code } });
  };
  //handleRowClick navigates to the "/add" route with specific data when a row is double-clicked.

  const handleSearchClick = () => {
    setFilterValue("");
  };
  //handleSearchClick clears the filter value when a search button is clicked.

  return (
    <div className="App">
      <Button variant="contained" onClick={handleClick}>
        ADD
      </Button>
      <br></br>
      <br></br>

      <div className="controls" style={{"float":"left","width":"150px"}}>
        <FormControl>
          <InputLabel id="filterSelect-label">Filter by Type:</InputLabel>
          <Select
            labelId="filterSelect-label"
            id="filterSelect"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ "margin-left": "150px", alignItems: "center" }}
          >
            <MenuItem value="">Select Group_Type</MenuItem>
            <MenuItem value="T">Type T</MenuItem>
            <MenuItem value="B">Type B</MenuItem>
            <MenuItem value="P">Type P</MenuItem>
          </Select>
        </FormControl>
      </div>
      <SearchBar
        value={searchTerm}
        onChange={handleSearchTermChange}
        onSearchClick={handleSearchClick}
      />
      <PerPageSelect value={perPage} onChange={handlePerPageChange} />
      <TableContainer>
        <h1>Posts Table</h1>
        <Table className="post-table">
          <TableHead>
            <TableRow>
              <TableCell>Group Code</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Group Type</TableCell>
              <TableCell>Group Summary</TableCell>
              <TableCell>Group Order</TableCell>
              <TableCell>Group BsId</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((post) => (
              <TableRow
                key={post.bsid}
                className="row-item"
                onDoubleClick={() => handleRowClick(post.group_Code)}
              >
                <TableCell>{post.group_Code}</TableCell>
                <TableCell>{post.group_Name_E}</TableCell>
                <TableCell>{post.group_Type}</TableCell>
                <TableCell>{post.group_Summary}</TableCell>
                <TableCell>{post.group_Order}</TableCell>
                <TableCell>{post.bsid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default GroupMasterDetail;
