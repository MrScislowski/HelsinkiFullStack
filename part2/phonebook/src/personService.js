import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(`${baseUrl}`).then((response) => response.data);
};

const addPerson = (newPerson) => {
  return axios.post(`${baseUrl}`, newPerson).then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

const updatePerson = (updatedPerson) => {
  return axios
    .put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
    .then((response) => response.data);
};

export default { getAll, addPerson, deletePerson, updatePerson };
