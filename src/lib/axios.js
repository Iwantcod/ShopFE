// lib/axios.js
import axios from 'axios';

import { API_URL } from '../config';

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
