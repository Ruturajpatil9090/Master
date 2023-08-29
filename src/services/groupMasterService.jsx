// This code we have to write our all get,post,put and delete api function for our groupMaster Component.
import api from "./api";

export const getGroupMasterData = () => {
  const url = `/groupmaster`;
  return api.get(url);
};

export const addGroupMasterRecord = (data) => {
  const url = `/groupmaster`;
  return api.post(url,data);
};

export const updateGroupMasterRecord = (group_Code,data) => {
  const url = `/groupmaster/${group_Code}`;
  return api.put(url,data);
};

export const deleteGroupMasterRecord = (group_Code) => {
  const url = `/groupmaster/${group_Code}`;
  return api.delete(url);
};


