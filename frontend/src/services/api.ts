import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${apiUrl}/api/url`;

export const createShortUrl = async (originalUrl: string) => {
  const response = await axios.post(API_BASE_URL, { originalUrl });
  return response.data;
};

export const getShortUrl = async (shortCode: string) => {
  const response = await axios.get(`${API_BASE_URL}/${shortCode}`);
  return response.data;
};
