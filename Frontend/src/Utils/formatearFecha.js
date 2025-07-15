export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-CL', opciones);
}