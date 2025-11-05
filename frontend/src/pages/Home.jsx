import React from "react";
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const Home = () => {
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
    <div
      style={{
        width: "1550px",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* 🔹 NAVBAR */}
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
      {/* 🔹 HERO — plein écran */}
      <section
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: "url('/src/assets/images/bg_3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#fff",
          marginTop: "70px", // pour éviter que la navbar cache le haut
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <h1 className="display-4 fw-bold ">
            Bienvenue sur <span style={{ color: "#6a11cb" }}>StudyLab Pro</span>
          </h1>
          <p className="lead mb-4">
            La plateforme moderne pour apprendre, enseigner et évoluer.
          </p>
          <a href="/about" className="btn btn-primary px-4 py-2">
            Découvrir
          </a>
        </div>
      </section>

      {/* 🔹 SERVICES */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#f8f9fc",
          padding: "80px 0",
          margin: 0,
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-5">💡 Nos Services</h2>
          <div className="row g-4 justify-content-center">
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
              <div key={i} className="col-md-4 col-sm-12">
                <div
                  className="card shadow border-0 h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    style={{
                      width: "100%",
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{s.title}</h5>
                    <p>{s.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 COURS POPULAIRES */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#fff",
          padding: "80px 0",
          margin: 0,
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-5">🎓 Nos Cours Populaires</h2>
          <div className="row g-4 justify-content-center">
            {[
              { title: "Programmation Web", img: "/src/assets/images/work-1.jpg" },
              { title: "Intelligence Artificielle", img: "/src/assets/images/work-2.jpg" },
              { title: "Design UX/UI", img: "/src/assets/images/work-3.jpg" },
            ].map((c, i) => (
              <div key={i} className="col-md-4 col-sm-12">
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.title}
                    style={{
                      width: "100%",
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{c.title}</h5>
                    <p>
                      Explorez nos cours interactifs et obtenez une certification
                      reconnue.
                    </p>
                    <a href="/course" className="btn btn-outline-primary">
                      Détails
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 POURQUOI NOUS CHOISIR */}
      <section
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "#fff",
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-5">Pourquoi nous choisir ?</h2>
          <div className="row justify-content-center g-4">
            {[
              {
                icon: "fa-solid fa-chalkboard-teacher",
                text: "Formateurs experts certifiés",
              },
              {
                icon: "fa-solid fa-globe",
                text: "Accessible partout, sur tous les appareils",
              },
              {
                icon: "fa-solid fa-certificate",
                text: "Diplômes et attestations reconnues",
              },
            ].map((a, i) => (
              <div key={i} className="col-md-4 col-sm-12">
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "30px",
                    borderRadius: "15px",
                    transition: "0.3s",
                  }}
                >
                  <i className={`${a.icon} fs-1 mb-3`}></i>
                  <p className="mb-0">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "#111",
          color: "#fff",
          textAlign: "center",
          padding: "25px 0",
          margin: 0,
        }}
      >
        <p className="mb-0">
          © 2025 StudyLab — Apprendre. Innover. Réussir.
        </p>
      </footer>
    </div>
  );
};

export default Home;
