import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // importa el hook del contexto

function LoginPage() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // obtenemos la función login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
 try {
     await login(email, contraseña);
   
    alert('Sesión iniciada correctamente');
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;
