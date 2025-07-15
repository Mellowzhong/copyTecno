export const getRole = (userRole) => {
  switch (userRole) {
    case 1:
      return "Administrador";
    case 2:
      return "Secretari@";
    case 3:
      return "Medic@";
    case 4:
      return "Psicolog@";
    case 5:
      return "Psicotecnic@";
    case 6:
      return "Documentador";
  }
};

export const getPathRole = (userRole) => {
  switch (userRole) {
    case "Administrador":
      return "/Administrador";
    case "Secretari@":
      return "/Secretary";
    case "Psicotecnic@":
      return "/Psicotecnica";
    case "Medic@":
      return "/Medic";
    case "Psicolog@":
      return "/Psychologist";
    case "Documentador":
      return "/Documentador";
  }
};
