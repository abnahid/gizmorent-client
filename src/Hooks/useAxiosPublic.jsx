import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: 'https://gizmorent-server.vercel.app'
})

const useAxiosPublic = () => {
  return axiosPublic
};


export default useAxiosPublic;