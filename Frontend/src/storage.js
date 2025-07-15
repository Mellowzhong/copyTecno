const USER_STORAGE_KEY = "user_data";

export const storage = {
  // Guardar datos del usuario
  setUserData: (data) => {
    try {
      const userData = {
        rol_usuario: data.rol_usuario,
        nombre_usuario: data.nombre_usuario,
        id_usuario: data.id_usuario,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error al guardar datos del usuario:", error);
    }
  },

  // Obtener datos del usuario
  getUserData: () => {
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  },

  // Obtener rol específico
  getUserRole: () => {
    const data = storage.getUserData();
    return data ? data.rol_usuario : null;
  },

  // Obtener ID específico
  getUserId: () => {
    const data = storage.getUserData();
    return data ? data.id_usuario : null;
  },

  // Limpiar datos del usuario
  clearUserData: () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Error al limpiar datos del usuario:", error);
    }
  },
};
