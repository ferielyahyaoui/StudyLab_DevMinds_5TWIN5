import React, { useState } from "react";
import axios from "axios";
import {  useEffect } from "react";
import { FaBell } from "react-icons/fa";
const API = "http://127.0.0.1:5000";

export default function ForgotPassword() {
      const [user, setUser] = useState(null); useEffect(() => { // Vérifie si l'utilisateur est connecté
       const storedUser = localStorage.getItem("user"); if (storedUser) { setUser(JSON.parse(storedUser)); }
        // Initialise Owl Carousel ou autres JS si nécessaire
         const $ = window.$; if ($) { $('.carousel-testimony').owlCarousel({ loop: true, items: 1, autoplay: true, autoplayTimeout: 5000, }); $('.no-gutters').animateNumber({ number: 400 }); } }, []); const handleLogout = () => { localStorage.removeItem("user"); setUser(null); }; 
         useEffect(() => { // Initialise Owl Carousel et autres JS du template // (assume jQuery global de main.js) 
         const $ = window.$; 
         // Si jQuery chargé global
          if ($) { $('.carousel-testimony').owlCarousel({
             loop: true, items: 1, autoplay: true, autoplayTimeout: 5000, }); $('.no-gutters').animateNumber({ number: 400 });
              // Ex. pour counters
               } }, []);
    
  const [step, setStep] = useState(1); // 1=email, 2=code, 3=done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/forgot`, { email });
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!code || !password) return setMsg("Tous les champs sont requis !");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/verify`, {
        email,
        code,
        new_password: password,
      });
      setMsg(res.data.message);
      setStep(3);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="container mt-5 pt-5" style={{ maxWidth: 500 }}>
          <nav
              className="navbar navbar-expand-lg navbar-dark"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                padding: "15px 40px",
                boxShadow: "0 2px 8px rgba(49, 12, 12, 0.3)",
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
        
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNavDropdown"
                  aria-controls="navbarNavDropdown"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
        
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul className="navbar-nav ms-auto d-flex flex-row mb-0 align-items-center">
        
                    {/* Always visible */}
                    <li className="nav-item mx-2"><a href="/" className="nav-link text-white">Home</a></li>
                    <li className="nav-item mx-2"><a href="/about" className="nav-link text-white">About</a></li>
        
                    {/* Visible only if user is connected */}
                    {user ? (
                      <>
                        {/* Resources Dropdown */}
                        <li className="nav-item dropdown mx-2">
                          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Resources
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/examens">Examens</a></li>
                            <li><a className="dropdown-item" href="/support">Supports</a></li>
                            <li><a className="dropdown-item" href="/exercices">Exercices</a></li>
                            <li><a className="dropdown-item" href="/course">Courses</a></li>
                            <li><a className="dropdown-item" href="/chapitres">Chapitres</a></li>
        
                          </ul>
                        </li>
        
                        {/* Events Dropdown */}
                        <li className="nav-item dropdown mx-2">
                          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Events
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/coursenligne">Cours en Ligne</a></li>
                            <li><a className="dropdown-item" href="/devoir">Devoir</a></li>
                            <li><a className="dropdown-item" href="/soutenance">Soutenance</a></li>
                          </ul>
                        </li>
        
                        {/* Institutions Dropdown */}
                        <li className="nav-item dropdown mx-2">
                          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Institutions
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/institutions">Institutions</a></li>
                            <li><a className="dropdown-item" href="/classe">Classe</a></li>
                            <li><a className="dropdown-item" href="/departement">Département</a></li>
                          </ul>
                        </li>
        
                        {/* Matière & Compétence */}
                        <li className="nav-item mx-2">
                          <a href="/matiere" className="nav-link text-white">Matière</a>
                        </li>
                        <li className="nav-item mx-2">
                          <a href="/competence" className="nav-link text-white">Compétence</a>
                        </li>
        
                        {/* Evaluation */}
                        <li className="nav-item dropdown mx-2">
                          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Évaluation
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/note">Note</a></li>
                            <li><a className="dropdown-item" href="/diplome">Diplôme</a></li>
                            <li><a className="dropdown-item" href="/attestation">Attestation</a></li>
                          </ul>
                        </li>
        
                        {/* Projets */}
                        <li className="nav-item mx-2">
                          <a href="/projets" className="nav-link text-white">Projets</a>
                        </li>
        
                        {/* Profile & Notifications */}
                        <li className="nav-item mx-2">
                          <a href="/userprofile" className="nav-link text-white">Profile</a>
                        </li>
                        <li className="nav-item mx-3">
                          <a href="/notifications" className="nav-link text-white d-flex align-items-center position-relative" style={{ fontSize: "1.2rem" }}>
                            <FaBell size={22} />
                          </a>
                        </li>
        
                        {/* Logout */}
                        <li className="nav-item mx-2">
                          <button
                            onClick={handleLogout}
                            className="btn btn-outline-light"
                            style={{ borderRadius: "10px", padding: "5px 15px" }}
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      // Si non connecté
                      <li className="nav-item mx-2">
                        <a href="/signup" className="nav-link text-white">Sign Up</a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </nav>
      <div  className="container mt-5 pt-5" style={{marginLeft:"500px"}}>
     
      <h3 className="mb-3 text-center"  >🔐 Mot de passe oublié</h3>
      {msg && <div className="alert alert-info">{msg}</div>}

      {step === 1 && (
        <form onSubmit={sendCode}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyCode}>
          <div className="mb-3">
            <label>Code reçu par e-mail</label>
            <input
              className="form-control"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          <div className="mb-3">
            <label>Nouveau mot de passe</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Vérification..." : "Réinitialiser"}
          </button>
        </form>
      )}
</div>
      {step === 3 && (
        <div className="text-center">
          <h5 className="text-success">✅ Mot de passe réinitialisé avec succès</h5>
          <a href="/signin" className="btn btn-primary mt-3">Se connecter</a>
        </div>
      )}
    </div>
    
  );
}
