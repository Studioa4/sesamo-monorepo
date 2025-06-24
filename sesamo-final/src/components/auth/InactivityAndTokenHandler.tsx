import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const TEMPO_INATTIVITÀ_MINUTI = 15;

export default function InactivityAndTokenHandler() {
  const navigate = useNavigate();
  const logoutEseguito = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const logout = () => {
      if (logoutEseguito.current) return;
      logoutEseguito.current = true;

      console.log("➡️ Logout eseguito");
      localStorage.clear();

      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          console.log("📍 Redirect verso /login");
          navigate("/login", { replace: true });
        }
      }, 100);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("📣 Evento ricevuto:", event, session);

      if ((event === "SIGNED_OUT" || event === "TOKEN_REFRESH_FAILED") && session === null) {
        logout();
      }
    });

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        console.log("⏱ Inattività → signOut");
        supabase.auth.signOut().then(({ error }) => {
          if (error) {
            console.error("❌ Errore in signOut:", error.message);
          } else {
            console.log("✅ signOut eseguito");
          }
        });
      }, TEMPO_INATTIVITÀ_MINUTI * 60 * 1000);
    };

    const eventi = ["mousemove", "keydown", "click"];
    eventi.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      eventi.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
}