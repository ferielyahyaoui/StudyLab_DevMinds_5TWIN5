import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";


const API_URL = "http://127.0.0.1:5000";

const Courses = () => {
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
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ codeCours: "", nomCours: "", volumeHoraire: "" });
  const [editMode, setEditMode] = useState(false);
  const [editCode, setEditCode] = useState("");

     const [searchTerm, setSearchTerm] = useState("");
     const handleSearch = () => {
      const filtered = examens.filter((ex) =>
        ex.nomCours.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExamens(filtered);
    };
  
  // Récupérer tous les cours
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Erreur fetchCourses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Ajouter ou Modifier un cours
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.codeCours || !form.nomCours || !form.volumeHoraire) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/courses/${editCode}`, form);
        setEditMode(false);
        setEditCode("");
      } else {
        await axios.post(`${API_URL}/courses`, form);
      }
      setForm({ codeCours: "", nomCours: "", volumeHoraire: "" });
      fetchCourses();
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    }
  };

  // Supprimer un cours
  const handleDelete = async (codeCours) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    try {
      await axios.delete(`${API_URL}/courses/${codeCours}`);
      fetchCourses();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  // Préparer la modification
  const handleEdit = (course) => {
    setForm({
      codeCours: course.codeCours,
      nomCours: course.nomCours,
      volumeHoraire: course.volumeHoraire,
    });
    setEditMode(true);
    setEditCode(course.codeCours);
  };

  return (
    <>
      {/* Navbar identique à Chapitres */}
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

      <div className="container mt-5 pt-5">
        <h2>Gestion des Cours</h2>
 <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>🔍 Search</button>
        </div>

        {/* Formulaire stylisé */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Code Cours</label>
            <input
              type="text"
              className="form-control"
              value={form.codeCours}
              onChange={(e) => setForm({ ...form, codeCours: e.target.value })}
              required
              disabled={editMode}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nom Cours</label>
            <input
              type="text"
              className="form-control"
              value={form.nomCours}
              onChange={(e) => setForm({ ...form, nomCours: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Volume Horaire</label>
            <input
              type="number"
              className="form-control"
              value={form.volumeHoraire}
              onChange={(e) => setForm({ ...form, volumeHoraire: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">{editMode ? "Modifier" : "Ajouter"}</button>
          {editMode && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditMode(false);
                setEditCode("");
                setForm({ codeCours: "", nomCours: "", volumeHoraire: "" });
              }}
            >
              Annuler
            </button>
          )}
        </form>

        {/* Table des cours */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Code Cours</th>
              <th>Nom Cours</th>
              <th>Volume Horaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.codeCours}>
                <td>{c.codeCours}</td>
                <td>{c.nomCours}</td>
                <td>{c.volumeHoraire}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(c)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.codeCours)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Aucun cours trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Courses;
