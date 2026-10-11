"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Қате: " + error.message);
      else setMessage("Сәтті тіркелдіңіз! Енді кіре аласыз.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage("Қате: " + error.message);
      } else {
        setMessage("Сәтті кірдіңіз!");
        window.location.href = "/";
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>

      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🚕</span>
          <h1 style={styles.logoText}>ЖелАяқ</h1>
        </div>
        <p style={styles.slogan}>ЖЫЛДАМ · СЕНІМДІ · ЫҢҒАЙЛЫ</p>

        <h2 style={styles.title}>
          {isSignUp ? "Тіркелу" : "Жүйеге кіру"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Құпиясөз"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {isSignUp ? "Тіркелу" : "Кіру"}
        </button>

        <p style={styles.toggle}>
          {isSignUp ? "Аккаунтыңыз бар ма? " : "Аккаунтыңыз жоқ па? "}
          <span
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            style={styles.toggleLink}
          >
            {isSignUp ? "Кіру" : "Тіркелу"}
          </span>
        </p>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif",
  },
  background: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.4)",
    zIndex: 0,
  },
  card: {
    position: "relative" as const,
    zIndex: 1,
    background: "rgba(20, 20, 20, 0.95)",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "40px",
  },
  logoText: {
    color: "#FFD700",
    fontSize: "34px",
    fontWeight: "900" as const,
    letterSpacing: "1px",
    margin: 0,
  },
  slogan: {
    color: "#aaa",
    fontSize: "11px",
    textAlign: "center" as const,
    letterSpacing: "3px",
    marginTop: "5px",
    marginBottom: "25px",
    textTransform: "uppercase" as const,
  },
  title: {
    color: "#fff",
    fontSize: "22px",
    textAlign: "center" as const,
    marginBottom: "30px",
    fontWeight: "400" as const,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "15px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,215,0,0.3)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#FFD700",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700" as const,
    cursor: "pointer",
    marginTop: "10px",
  },
  toggle: {
    color: "#aaa",
    textAlign: "center" as const,
    marginTop: "20px",
    fontSize: "14px",
  },
  toggleLink: {
    color: "#FFD700",
    cursor: "pointer",
    fontWeight: "600" as const,
    textDecoration: "underline",
  },
  message: {
    color: "#FFD700",
    textAlign: "center" as const,
    marginTop: "15px",
    fontSize: "14px",
    padding: "10px",
    background: "rgba(255,215,0,0.1)",
    borderRadius: "8px",
  },
};