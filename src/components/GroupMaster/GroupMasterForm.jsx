import React, { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormButtons from "../common/CommonButtons";
import {
  getGroupMasterData,
  addGroupMasterRecord,
  updateGroupMasterRecord,
  deleteGroupMasterRecord,
} from "../../services/groupMasterService";
import "../../App.css";
import Form from 'react-bootstrap/Form';

// This section imports necessary dependencies, including React components (useState, useEffect) from React
// routing-related hooks (useNavigate, useLocation) from react-router-dom, axios for making HTTP requests, and other components. like FormButtons. 
// It also imports some functions from a service called groupMasterService.

function GroupMasterForm() {
  const initialFormData = {
    group_Code: "",
    group_Name_E: "",
    group_Name_R: "",
    group_Type: "B",
    group_Summary: "",
    group_Order: "",
    Company_Code: "",
    Created_By: "",
    Modified_By: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [fieldsFilled, setFieldsFilled] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditSaveMode, setIsEditSaveMode] = useState(false);
  const [recordData, setRecordData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDoubleClickEditing, setIsDoubleClickEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // This section defines the GroupMasterForm function component. It initializes various state variables using the useState hook. 
  // These states manage aspects like form data, whether the form is in "adding" mode, "editing" mode, "edit save" mode, the data fetched from the server, 
  // the current index for the displayed record, and whether double-click editing is enabled. It also utilizes the useNavigate and useLocation hooks for routing.

  //Fetch the last record in the database and display it on feilds
  const fetchLastRecords = async () => {
    try {
      const response = await getGroupMasterData();

      setRecordData(response.data);
      if (response.data.length > 0) {
        const lastRecord = response.data[response.data.length - 1];
        setFormData({
          group_Code: lastRecord.group_Code || "",
          group_Name_E: lastRecord.group_Name_E || "",
          group_Type: lastRecord.group_Type || "B",
          group_Summary: lastRecord.group_Summary || "N",
          group_Order: lastRecord.group_Order || "",
        });
        setCurrentIndex(response.data.length - 1);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  
//1. fetchLastRecords is an asynchronous function, indicated by the async keyword.
//2. Inside the function, it attempts to fetch data using the getGroupMasterData function.
//3. If the data is successfully fetched, the response data is assigned to the recordData state using the setRecordData function.
//4. It then checks if there's data in the response (response.data.length > 0). If there is data, it proceeds to extract the last record from the data array.
//5. The data from the last record is then used to update the formData state using the setFormData function. The properties like group_Code, group_Name_E, etc., are updated with values from the last record. If a value is not present in the last record, default values or empty strings are used.
//6. The setCurrentIndex function is called to set the current index to the last index in the data array (response.data.length - 1).

  useEffect(() => {
    if (location.state && location.state.editRecordCode) {
      const selectedRecordCode = location.state.editRecordCode;
      fetchSelectedRecord(selectedRecordCode);
      console.log(selectedRecordCode);
    } else {
      handleAddOne();
    }
  }, [location.state]);

// 1. The useEffect hook is used to perform side effects in functional components. It takes two arguments: a function and a dependency array. The function inside the useEffect will be executed when the dependencies change.
// 2. In this case, the dependency array contains only location.state, so the effect will be triggered whenever location.state changes.
// 3. The code first checks if there's a location.state object and if it contains the property editRecordCode. This check is to determine if the component is being accessed in edit mode for a specific record.
// 4 .If editRecordCode is present, it means the component is accessed for editing a specific record.
// 5. The value of editRecordCode is then stored in the selectedRecordCode variable.
// 6.The fetchSelectedRecord(selectedRecordCode) function is called with selectedRecordCode as an argument. 
// 7.This function fetches and updates the component's state with the record associated with the provided code.
// 8.If there's no editRecordCode in the location.state, it means the component is not in edit mode, and the fetchLastRecords() function is called to fetch the last records.
  

  //If we have to double click the particular record in GroupMasterDetails we added this selected record for edit.
  const fetchSelectedRecord = async (group_Code) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/groupmaster/${group_Code}`
      );

      if (response.status === 200) {
        const selectedRecord = response.data;
        setFormData(selectedRecord);
        setIsDoubleClickEditing(true);
        setIsAdding(false);
        setIsEditing(false);
        setIsEditSaveMode(false);
      } else {
        console.error("Error fetching record:", response.statusText);
      }
      
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

//fetchSelectedRecord is an asynchronous function that takes a parameter group_Code.
// Inside the function, it makes an HTTP GET request using the axios.get function to a specific URL constructed using the group_Code.
// Once the response is received, it checks if the response status code is 200 (OK) using response.status === 200.
// If the status is 200, it means the request was successful, and it extracts the data from the response using response.data and assigns it to the selectedRecord variable.
// The function then uses various state update functions to update the component's state:
//      1. setFormData(selectedRecord) updates the form data state with the values from the selected record.
//      2. setIsDoubleClickEditing(true) sets a state variable to indicate that the component is in a double-click editing mode.
//      3. setIsAdding(false) sets a state variable to indicate that the component is not in adding mode.
//      4. setIsEditing(false) sets a state variable to indicate that the component is not in editing mode.
//      5. setIsEditSaveMode(false) sets a state variable to indicate that the component is not in edit-save mode.


  useEffect(() => {
    if (recordData.length > 0) {
      const record = recordData[currentIndex];

      setFormData({
        group_Code: record.group_Code || "",
        group_Name_E: record.group_Name_E || "",
        group_Type: record.group_Type || "",
        group_Summary: record.group_Summary || "",
        group_Order: record.group_Order || "",
      });
    }
  }, [currentIndex, recordData]);

//This useEffect watches for changes in currentIndex or recordData. 
//If there's data in recordData, it retrieves the record at the current index and updates the form state with its values, 
// the form fields reflect the selected record's data during navigation within the records.

  //Form submit event handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleSaveOrUpdate = async () => {
    if (isAdding) {
      try {
        // Fetch the list of existing group_Code values
        const existingGroupCodesResponse = await getGroupMasterData()
        const existingGroupCodes = existingGroupCodesResponse.data.map(
          (record) => parseInt(record.group_Code)
        );

        const maxGroupCode = Math.max(...existingGroupCodes);
        const newGroupCode = (maxGroupCode + 1).toString();

        const newData = { ...formData, group_Code: newGroupCode };

        const response = await addGroupMasterRecord(newData);
        console.log("Data posted:", response.data);
        window.alert("Record added successfully");
        setIsAdding(false);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    } else if (isEditing) {
      try {
        const response = await updateGroupMasterRecord(formData.group_Code,formData)
        console.log("Data updated:", response.data);
        window.alert("Record Update successfully");
        setIsAdding(false)
    

      } catch (error) {
        console.error("Error updating data:", error);
      }
    }

  };

  // const handleSaveOrUpdate  This defines an asynchronous function named handleSaveOrUpdate.
  //   ** if (isAdding) = Checks if the component is in "adding" mode,Inside the "adding" mode block;
  //   1.const existingGroupCodesResponse = await getGroupMasterData(); => Fetches existing group codes from the server using the getGroupMasterData function.
  //   2.const existingGroupCodes = existingGroupCodesResponse.data.map(...) => Extracts existing group codes from the fetched data and converts them to integers.
  //   3.const maxGroupCode = Math.max(...existingGroupCodes); => Calculates the maximum group code value from the existing codes.
  //   4.const newGroupCode = (maxGroupCode + 1).toString(); => Generates a new group code by incrementing the maximum code and converting it to a string.
  //   5.const newData = { ...formData, group_Code: newGroupCode }; => Creates a new data object by spreading existing formData and updating the group code with the new one.
  //   6.const response = await addGroupMasterRecord(newData); => Calls the addGroupMasterRecord function to add the new data to the server.

  //   ** else if (isEditing) =>  Checks if the component is in "editing" mode.
  //   const response = await axios.put(...) => Sends an HTTP PUT request to update the record with the new form data using axios.put.
  //   Logs success and updates the state if successful, or logs an error if not.

  //handle edit button functionality
  const handleEdit = async () => {
    setIsAdding(false);
    setIsEditing(true);
    setIsEditSaveMode(true);
    setIsDoubleClickEditing(true);
  
  };

  const handleDelete = async () => {
    try {
      const response = await deleteGroupMasterRecord(formData.group_Code)
      console.log("Data deleted:", response.data);
      const updatedRecordData = recordData.filter(
        (record) => record.group_Code !== formData.group_Code
      );
      setRecordData(updatedRecordData);
      if (updatedRecordData.length > 0) {
        const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0;

        setFormData({
          group_Code: updatedRecordData[prevIndex].group_Code,
          group_Name_E: updatedRecordData[prevIndex].group_Name_E,
          group_Type: updatedRecordData[prevIndex].group_Type,
          group_Summary: updatedRecordData[prevIndex].group_Summary,
          group_Order: updatedRecordData[prevIndex].group_Order,
        });
        setCurrentIndex(prevIndex);
      } else {
        setFormData(initialFormData);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setIsAdding(false);
    setIsEditing(false);
    setIsEditSaveMode(false);
  };

//const response = await deleteGroupMasterRecord(formData.group_Code);
// => Calls the deleteGroupMasterRecord function to delete the record associated with the current group_Code. 
//The response data is stored in the response variable.
// ** const updatedRecordData = recordData.filter(...) => Filters the recordData array to exclude means remove the deleted record based on the group_Code,and show the new array updatedRecordData.
//setRecordData(updatedRecordData); => Updates the state variable recordData with the filtered array, they removing the deleted record from the displayed data.
//If there are still records in the list (updatedRecordData.length > 0), the code calculates the previous index,
//The calculation is done by subtracting 1 from the current index (currentIndex) if it's greater than or equal to 1. Otherwise, it sets the previous index to 0.
//If no records remain, the form data state is reset to initialFormData, and the current index is set to 0.  


const handleCancel = () => {
    setFormData(fetchLastRecords);
    setIsAdding(false);
    setIsEditing(false);
    setIsEditSaveMode(false);
  };

//handle cancel function they reset the all the feilds and go back to addone reacord

  //manage the state on handlechange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const allFieldsFilled = Object.values(formData).every(
      (fieldValue) => fieldValue !== ""
    );
    setFieldsFilled(allFieldsFilled);
  };

  const handleBack = () => {
    navigate("/");
    setIsEditSaveMode(false);
  };

  //In handle Back function we have to nevigate to another page using useNavigation hook 

  const handleAddOne = async () => {
    setIsAdding(true);
    setIsEditing(false);
    setIsEditSaveMode(false);

    try {
      const response = await getGroupMasterData();
      const existingGroupCodes = response.data.map((record) =>
        parseInt(record.group_Code)
      );

      if (existingGroupCodes.length > 0) {
        const newGroupCode = (Math.max(...existingGroupCodes) + 1).toString();
        setFormData({
          ...initialFormData,
          group_Code: newGroupCode,
        });
      } else {
        try {
          // Try to add the first record
          const response = await addGroupMasterRecord(initialFormData);
          console.log("First record added:", response.data);
          setFormData({
            ...initialFormData,
            group_Code: "1",
          });
        } catch (error) {
          console.error("Error adding first record:", error);
          // Handle the error here, such as displaying an error message to the user
        }
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

// 1. const response = await getGroupMasterData();: Fetches the existing group data using the getGroupMasterData function.
// 2. const existingGroupCodes = response.data.map(...) => Extracts the group codes from the fetched data and converts them to integers.
// ** If there are existing group codes:
//       *Calculates a new group code by adding 1 to the maximum existing group code.
//        *Updates the formData state with initial form data but with the new group code.
// I their is no record found we have to add a first record.


  const handleFirst = () => {
    setCurrentIndex(0);
  };

  const handleLast = () => {
    setCurrentIndex(recordData.length - 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < recordData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  //handle double clcik edit
  const handleDoubleClickEdit = () => {
    fetchSelectedRecord(formData.group_Code);
    setIsEditSaveMode(false);
  };

  return (
    <>
      <div>
        <h1 style={{"textAlign":"center"}}>Group Master</h1>
        <br></br>
        <Form onSubmit={handleSubmit} className="text-center">
        <FormButtons
            isAdding={isAdding}
            isEditing={isEditing}
            isEditSaveMode={isEditSaveMode}
            handleAddOne={handleAddOne}
            handleSaveOrUpdate={handleSaveOrUpdate}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleBack={handleBack}
            handleDelete={handleDelete}
            handleFirst={handleFirst}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleLast={handleLast}
            currentIndex={currentIndex}
            recordData={recordData}
          />
        <Form.Group className="col-md-4 mx-auto">
        <Form.Label style={{"float":"left"}}>Group Code:</Form.Label>
        <Form.Control
          type="text"
          name="group_Code"
          value={formData.group_Code}
          onChange={handleChange}
          onDoubleClick={handleDoubleClickEdit}
          disabled={(!isAdding || formData.group_Code !== '') && !isDoubleClickEditing}
        />
      </Form.Group>
      <Form.Group className="col-md-4 mx-auto">
        <Form.Label style={{"float":"left"}}>Group Name:</Form.Label>
        <Form.Control
          type="text"
          name="group_Name_E"
          value={formData.group_Name_E}
          onChange={handleChange}
          disabled={!isEditing && !isAdding}
        />
      </Form.Group>
      <Form.Group className="col-md-4 mx-auto">
        <Form.Label style={{"float":"left"}}>Group Type:</Form.Label>
        <Form.Control
          as="select"
          name="group_Type"
          value={formData.group_Type}
          onChange={handleChange}
          disabled={!isEditing && !isAdding}
        >
          <option value="B">Balance Sheet</option>
          <option value="T">Trading</option>
          <option value="P">Profit & Loss</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="col-md-4 mx-auto">
        <Form.Label style={{"float":"left"}}>Group Summary:</Form.Label>
        <Form.Control
          as="select"
          name="group_Summary"
          value={formData.group_Summary}
          onChange={handleChange}
          disabled={!isEditing && !isAdding}
        >
          <option value="N">No</option>
          <option value="Y">Yes</option>
        </Form.Control>
      </Form.Group >
      <Form.Group className="col-md-4 mx-auto">
        <Form.Label style={{"float":"left"}}>Group Order:</Form.Label>
        <Form.Control
          type="number"
          name="group_Order"
          value={formData.group_Order}
          onChange={handleChange}
          disabled={!isEditing && !isAdding}
        />
      </Form.Group>
          <br />
          <br />
          
        </Form>
      </div>
    </>
  );
}

export default GroupMasterForm;
