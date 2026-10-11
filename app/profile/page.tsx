"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = "/login";
        return;
      }
      setUser(userData.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
      });

    if (error) {
      setMessage("Қате: " + error.message);
    } else {
      setMessage("Профиль сәтті сақталды!");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <p style={{ padding: 40, color: "#fff", background: "#111", minHeight: "100vh" }}>Жүктелуде...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👤 Профиль</h1>

        <div style={styles.avatar}>
          <span style={styles.avatarText}>
            {fullName ? fullName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
          </span>
        </div>

        <p style={styles.email}>{user?.email}</p>

        <label style={styles.label}>Аты-жөні</label>
        <input
          type="text"
          placeholder="Мысалы: Ерасыл Жолдасбай"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Телефон нөмірі</label>
        <input
          type="text"
          placeholder="+7 777 123 45 67"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSave} disabled={saving} style={styles.button}>
          {saving ? "Сақталуда..." : "Сақтау"}
        </button>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Шығу
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>

      <div style={styles.bottomNav}>
        <a href="/" style={styles.navItem}>
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navText}>Басты</span>
        </a>
        <a href="/profile" style={styles.navItemActive}>
          <span style={styles.navIcon}>👤</span>
          <span style={styles.navText}>Профиль</span>
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 80,
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(20, 20, 20, 0.95)",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },
  title: {
    color: "#FFD700",
    textAlign: "center" as const,
    marginBottom: 20,
    fontSize: 26,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "#FFD700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },
  avatarText: {
    color: "#000",
    fontSize: 40,
    fontWeight: "900" as const,
  },
  email: {
    color: "#aaa",
    textAlign: "center" as const,
    fontSize: 14,
    marginBottom: 25,
  },
  label: {
    color: "#FFD700",
    fontSize: 13,
    marginBottom: 5,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
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
  logoutButton: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#ff5555",
    border: "1px solid #ff5555",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600" as const,
    cursor: "pointer",
    marginTop: "10px",
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
  bottomNav: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(20, 20, 20, 0.98)",
    borderTop: "1px solid rgba(255,215,0,0.3)",
    display: "flex",
    justifyContent: "space-around",
    padding: "12px 0",
    zIndex: 100,
  },
  navItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    color: "#888",
    textDecoration: "none",
    gap: 4,
    padding: "5px 20px",
  },
  navItemActive: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    color: "#FFD700",
    textDecoration: "none",
    gap: 4,
    padding: "5px 20px",
  },
  navIcon: { fontSize: 22 },
  navText: { fontSize: 11, fontWeight: "600" as const },
};