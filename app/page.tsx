"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [driverFound, setDriverFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const calculatePrice = () => {
    if (!from || !to) {
      alert("Алдымен мекенжайларды толтырыңыз!");
      return;
    }
    const randomPrice = Math.floor(Math.random() * 1500) + 500;
    setPrice(randomPrice);
  };

  const handleOrder = () => {
    if (!from || !to || !price) {
      alert("Алдымен мекенжайларды толтырып, бағаны есептеңіз!");
      return;
    }
    setDriverFound(true);
    setTimeout(() => {
      alert(`✅ Жүргізуші табылды!\n\nҚайдан: ${from}\nҚайда: ${to}\nБағасы: ${price} ₸`);
    }, 2000);
  };

  if (loading) return <p style={{ padding: 40, color: "#fff", background: "#111", minHeight: "100vh" }}>Жүктелуде...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
       <Map from={from} to={to} />
      
      </div>

      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>🚕 Қайда барасыз?</h2>

        <input
          type="text"
          placeholder="📍 Қайдан (мекенжай)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="🎯 Қайда (мекенжай)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={styles.input}
        />

        <button onClick={calculatePrice} style={styles.calcBtn}>
          Бағаны есептеу
        </button>

        {price && (
          <div style={styles.priceBox}>
            <span style={styles.priceLabel}>Бағасы:</span>
            <span style={styles.priceValue}>{price} ₸</span>
          </div>
        )}

        <button onClick={handleOrder} style={styles.orderBtn}>
          {driverFound ? "🔍 Жүргізуші ізделуде..." : "🚕 Такси шақыру"}
        </button>
      </div>

      <div style={styles.bottomNav}>
        <a href="/" style={styles.navItemActive}>
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navText}>Басты</span>
        </a>
        <a href="/profile" style={styles.navItem}>
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
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    paddingBottom: 80,
    position: "relative" as const,
  },
  mapContainer: {
    height: "45vh",
    width: "100%",
    background: "#222",
    position: "relative" as const,
  },
  panel: {
    background: "#111",
    padding: "20px 25px 30px",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    position: "relative" as const,
    zIndex: 10,
  },
  panelTitle: {
    color: "#FFD700",
    fontSize: 20,
    marginTop: 0,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 12,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,215,0,0.3)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  calcBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#FFD700",
    border: "1px solid #FFD700",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "600" as const,
    cursor: "pointer",
    marginBottom: 12,
  },
  priceBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    background: "rgba(255,215,0,0.1)",
    border: "1px solid rgba(255,215,0,0.3)",
    borderRadius: 12,
    marginBottom: 12,
  },
  priceLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  priceValue: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "700" as const,
  },
  orderBtn: {
    width: "100%",
    padding: "16px",
    background: "#FFD700",
    color: "#000",
    border: "none",
    borderRadius: 12,
    fontSize: 17,
    fontWeight: "700" as const,
    cursor: "pointer",
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