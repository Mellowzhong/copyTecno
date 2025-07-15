import clienteHttp from "../http-common/usuarios-http-common";

const obtenerTodos = () => {
  return clienteHttp.get("/Usuario/obtenerUsuarios");
};

const guardarUsuario = (usuario) => {
  return clienteHttp.post("/Usuario/actualizarUsuario", usuario);
};

export default {
  obtenerTodos,
  guardarUsuario,
};
