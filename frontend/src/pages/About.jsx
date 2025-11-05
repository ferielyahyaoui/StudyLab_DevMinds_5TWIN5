import React from "react";
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const About = () => {
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
  return (
    
    <div style={{ backgroundColor: "#f8f9fc", width: "100%", overflowX: "hidden" }}>
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
      {/* 🔹 Hero Section */}
      <section
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: "url('/src/assets/images/about-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1,
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 className="fw-bold display-4">À propos de Smart Education</h1>
          <p className="lead mt-3">Innover aujourd’hui, éduquer pour demain 🎓</p>
        </div>
      </section>

      {/* 🔹 About Us Section */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#fff",
          padding: "80px 5%",
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/src/assets/images/bg_1.jpg"
              alt="Notre équipe"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Qui sommes-nous ?</h2>
            <p style={{ textAlign: "justify", color: "#555" }}>
              Smart Education est une plateforme dédiée à l’apprentissage
              intelligent et interactif. Notre mission est de connecter les
              étudiants, enseignants et institutions à travers des outils modernes
              et des ressources numériques de qualité.
            </p>
            <p style={{ textAlign: "justify", color: "#555" }}>
              Nous croyons en une éducation inclusive, innovante et durable.
              Grâce à l’intelligence artificielle et au web sémantique, nous
              facilitons l’accès à la connaissance et optimisons les parcours
              d’apprentissage.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Nos Services */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#f2f5fc",
          padding: "80px 5%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 className="fw-bold mb-3">🚀 Nos Services</h2>
          <p className="text-muted">Des outils modernes pour faciliter l’apprentissage</p>
        </div>
        <div className="row g-4">
          {[
            {
              img: "/src/assets/images/image_2.jpg",
              title: "Cours en Ligne",
              text: "Accédez à des cours interactifs créés par des enseignants qualifiés et suivez votre progression à tout moment.",
            },
            {
              img: "/src/assets/images/image_4.jpg",
              title: "Évaluations et Examens",
              text: "Participez à des tests, examens et soutenances pour évaluer vos compétences.",
            },
            {
              img: "/src/assets/images/image_5.jpg",
              title: "Suivi et Analyse",
              text: "Visualisez vos progrès grâce à des tableaux de bord et rapports dynamiques.",
            },
          ].map((s, i) => (
            <div key={i} className="col-md-4">
              <div
                className="card border-0 shadow h-100"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <img src={s.img} alt={s.title} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{s.title}</h5>
                  <p className="card-text">{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Notre Mission */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#fff",
          padding: "80px 5%",
        }}
      >
        <div className="text-center mb-5">
          <h2 className="fw-bold">🎯 Notre Mission</h2>
          <p className="text-muted">
            Offrir à chaque apprenant les outils pour réussir dans un monde numérique.
          </p>
        </div>
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="fw-bold text-primary">✨ Une vision innovante</h5>
            <p>
              Nous mettons l'accent sur l’adaptabilité et la personnalisation des
              parcours éducatifs grâce à la technologie sémantique.
            </p>
            <h5 className="fw-bold text-primary mt-4">🌍 Une portée internationale</h5>
            <p>
              Smart Education connecte des institutions et apprenants de plusieurs
              pays, favorisant la collaboration mondiale.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="/src/assets/images/about.jpg"
              alt="Notre mission"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "#111",
          color: "#fff",
          textAlign: "center",
          padding: "25px 0",
          marginTop: "0",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2025 Smart Education — Apprendre, Innover, Partager.
        </p>
      </footer>
    </div>
  );
};

export default About;
