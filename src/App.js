import GroupMasterDetail from "./components/GroupMaster/GroupMasterDetail";
import GroupMasterForm from "./components/GroupMaster/GroupMasterForm";
//import SimpleForm from "./components/GroupMaster/SimpleForm";
import {Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    
        <Routes>
          <Route path="/" Component={GroupMasterDetail} />
          <Route path="/add" Component={GroupMasterForm} />
          {/* <Route path="/add" Component={SimpleForm} /> */}
        </Routes>
      
    </>
  );
}

export default App;
