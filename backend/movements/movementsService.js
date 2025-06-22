exports.crearMovimiento = (data) => {
  return {
    id: Date.now(), // ID simple
    tipo: data.tipo, // 'gasto' o 'ingreso'
    monto: Number(data.monto),
    categoria: data.categoria,
    descripcion: data.descripcion || '',
    fecha: new Date().toISOString()
  };
};
