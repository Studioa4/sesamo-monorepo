import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [loading, setLoading] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("🟢 Login component montato");

    supabase.auth.getSession().then(({ data }) => {
      console.log("🔎 Sessione rilevata al login:", data.session);
    });

    loginButtonRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrore('Inserisci email e password');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("❌ Errore login:", error.message);
      setErrore(error.message);
    } else {
      console.log("✅ Login riuscito:", data);
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('utente', JSON.stringify(data.user));
      navigate('/stabili'); // redirect corretto
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4 text-center">
          <img src="/logo.png" className="h-12 mx-auto mb-2" />
          <h1 className="text-xl font-bold">Login a Sesamo</h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        {errore && <p className="text-red-500 text-sm mb-4">{errore}</p>}
        <button
          ref={loginButtonRef}
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Accesso in corso..." : "Login"}
        </button>
      </div>
    </div>
  );
}