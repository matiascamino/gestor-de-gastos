import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  
import './styles/LoginPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();  // obtené la función register del contexto

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ nombre, email, contraseña });
      alert("Registrado con éxito");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message); // Esto ya va a mostrar "Este correo ya está registrado"
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Registro de Usuario</h2>
      <form onSubmit={handleRegister} className="login-form">
        <input
          className="login-input"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;
