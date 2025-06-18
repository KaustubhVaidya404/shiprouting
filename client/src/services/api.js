import axios from 'axios';

// Configure the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with base settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch ports with optional filters
 * @param {Object} filters - Optional filter parameters
 * @param {string} filters.search - Filter by name or ID
 * @param {string} filters.country - Filter by country
 * @param {number} filters.limit - Max number of results
 * @param {number} filters.offset - Pagination offset
 * @returns {Promise<Object>} Response with ports array and total count
 */
export const fetchPorts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);
    
    const response = await apiClient.get(`/ports?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ports:', error);
    throw error;
  }
};

/**
 * Fetch all ship types
 * @returns {Promise<Object>} Response with shipTypes array
 */
export const fetchShipTypes = async () => {
  try {
    const response = await apiClient.get('/ship-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching ship types:', error);
    throw error;
  }
};

/**
 * Fetch all cargo types
 * @returns {Promise<Object>} Response with cargoTypes array
 */
export const fetchCargoTypes = async () => {
  try {
    const response = await apiClient.get('/cargo-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching cargo types:', error);
    throw error;
  }
};

/**
 * Compute a route
 * @param {Object} params - Route parameters
 * @param {string} params.startPortId - Starting port ID
 * @param {string} params.endPortId - Destination port ID
 * @param {string} params.shipTypeId - Ship type ID
 * @param {string} params.cargoTypeId - Cargo type ID
 * @param {Object} params.weights - Optional weight parameters
 * @param {Object} params.avoid - Optional avoidance parameters
 * @returns {Promise<Object>} Route calculation result
 */
export const computeRoute = async (params) => {
  try {
    const response = await apiClient.post('/compute-route', params);
    return response.data;
  } catch (error) {
    console.error('Error computing route:', error);
    throw error;
  }
};

/**
 * Fetch weather for given coordinates
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
export const fetchWeather = async (lat, lon) => {
  try {
    const response = await apiClient.get(`/weather?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

// Create a named API object for export
const apiService = {
  fetchPorts,
  fetchShipTypes,
  fetchCargoTypes,
  computeRoute,
  fetchWeather
};

export default apiService;
