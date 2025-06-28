import { useState } from "react";

function MovementForm({ agregarMovimiento }) {
    const [form, setForm] = useState({
        monto: '',
        tipo: 'gasto',
        categoria: '',
        fecha: '',
        descripcion: '' // Fixed typo in 'descripcion'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarMovimiento({ ...form, id: crypto.randomUUID() });
        setForm({ monto: '', tipo: 'gasto', categoria: '', fecha: '', descripcion: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="monto" value={form.monto} onChange={handleChange} placeholder="Monto" required />
            <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
            </select>
            <select name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="alimentos">Alimentos</option>
                <option value="transporte">Transporte</option>
                <option value="servicios">Servicios</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educacion</option>
                <option value="ropa">Ropa</option>
                <option value="otros">Otros</option>
            </select>
            <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
            />
            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripcion" required />
            <button type="submit">Guardar movimiento</button>
        </form>
    );
}

export default MovementForm;