import axios from "axios";

const formularioHttp = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true
});

export default formularioHttp;