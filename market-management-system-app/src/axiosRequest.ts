import axios from "axios"
import { URL_SERVER } from "./constant"
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: URL_SERVER || '',
  })
  instance.interceptors.request.use(async (config) => {
    const jwtToken = await AsyncStorage.getItem('token');
    if (jwtToken) {
      config.headers['Authorization'] = `Bearer ${jwtToken}`
    }
    return config
  })

  export const axiosInstance = instance