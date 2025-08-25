const express = require('express');
const router = express.Router();
const axios = require('axios');
// Dummy user data api
// Replace this URL with the actual API endpoint you want to fetch users from
// const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';
const USERS_API_URL = 'https://heimdall-stag.mod.gov.my/admin/realms/krln/users/count';

const getUsers = async () => {
  try {
    const response = await axios
    s.get(USERS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${USERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

const createUser = async (user) => {
  try {
    const response = await axios.post(USERS_API_URL, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${USERS_API_URL}/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(`${USERS_API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

module.exports = router;