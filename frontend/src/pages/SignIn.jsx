import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motdepasse: password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Connexion réussie !");
        // Stocke l'IRI et l'email
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/userprofile";
      } else {
        alert(data.message || "Email ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion !");
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          padding: "15px 40px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand fw-bold" href="/" style={{ fontSize: "1.6rem" }}>
            <span style={{ color: "#6a11cb" }}>Study</span>
            <span style={{ color: "#fff" }}>Lab</span>
          </a>
          <ul className="navbar-nav d-flex flex-row mb-0">
            <li className="nav-item mx-2"><a href="/" className="nav-link text-white">Home</a></li>
            <li className="nav-item mx-2"><a href="/about" className="nav-link text-white">About</a></li>
            <li className="nav-item mx-2"><a href="/course" className="nav-link text-white">Course</a></li>
            <li className="nav-item mx-2"><a href="/signin" className="nav-link text-white active">Sign In</a></li>
          </ul>
        </div>
      </nav>

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "80px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            padding: "60px 50px",
            width: "800px",
            maxWidth: "460px",
            textAlign: "center",
            animation: "fadeIn 0.7s ease-in-out",
            marginLeft:"500px"
          }}
        >
          <h3 style={{ color: "#222", fontWeight: "700", marginBottom: "10px" }}>
            🔐 Sign In to Smart Education
          </h3>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Access your courses and learning dashboard
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div className="form-group mb-3">
              <label htmlFor="email" style={{ fontWeight: "500", color: "#333", marginBottom: "6px", display: "block" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password" style={{ fontWeight: "500", color: "#333", marginBottom: "6px", display: "block" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group text-center mb-3">
              <a href="/forgot" style={{ fontSize: "14px", color: "#2575fc", textDecoration: "none" }}>Forgot Password?</a>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <i className="fa fa-sign-in mr-2"></i> Login
            </button>
          </form>

          <p style={{ color: "#777", marginTop: "25px" }}>
            Don’t have an account?{" "}
            <a href="/signup" style={{ color: "#2575fc", textDecoration: "none", fontWeight: "500" }}>Register Now</a>
          </p>
        </div>
      </div>

      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-15px); }
            to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </>
  );
};

export default SignIn;