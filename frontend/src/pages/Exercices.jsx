import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Exercices = () => {
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
  const [exercices, setExercices] = useState([]);
  const [form, setForm] = useState({ titreExercice: "", difficulte: "", score: "" });
  const [editMode, setEditMode] = useState(false);
  const [editTitre, setEditTitre] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
   const handleSearch = () => {
    const filtered = examens.filter((ex) =>
      ex.titreExercice.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExamens(filtered);
  };

  // --------- Récupérer tous les exercices ----------
  const fetchExercices = async () => {
    try {
      const res = await axios.get(`${API_URL}/exercices`);
      setExercices(res.data);
    } catch (err) {
      console.error("Erreur fetchExercices:", err);
    }
  };

  useEffect(() => {
    fetchExercices();
  }, []);

  // --------- Ajouter ou Modifier un exercice ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titreExercice || !form.difficulte || !form.score) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/exercices/${editTitre}`, form);
        setEditMode(false);
        setEditTitre("");
      } else {
        await axios.post(`${API_URL}/exercices`, form);
      }
      setForm({ titreExercice: "", difficulte: "", score: "" });
      fetchExercices();
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    }
  };

  // --------- Supprimer un exercice ----------
  const handleDelete = async (titreExercice) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet exercice ?")) return;
    try {
      await axios.delete(`${API_URL}/exercices/${titreExercice}`);
      fetchExercices();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  // --------- Préparer la modification ----------
  const handleEdit = (exercice) => {
    setForm({
      titreExercice: exercice.titreExercice,
      difficulte: exercice.difficulte,
      score: exercice.score,
    });
    setEditMode(true);
    setEditTitre(exercice.titreExercice);
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
      <h2>Gestion des Exercices</h2>
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

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            value={form.titreExercice}
            onChange={(e) => setForm({ ...form, titreExercice: e.target.value })}
            required
            disabled={editMode} // impossible de modifier le titre lors de l'édition
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Difficulté</label>
          <input
            type="text"
            className="form-control"
            value={form.difficulte}
            onChange={(e) => setForm({ ...form, difficulte: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Score</label>
          <input
            type="number"
            className="form-control"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
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
              setEditTitre("");
              setForm({ titreExercice: "", difficulte: "", score: "" });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* Liste des exercices */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Difficulté</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercices.map((ex) => (
            <tr key={ex.titreExercice}>
              <td>{ex.titreExercice}</td>
              <td>{ex.difficulte}</td>
              <td>{ex.score}</td>
              <td>
              {user && user.role === "enseignant" && <th>Actions</th>}
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(ex)}>Modifier</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ex.titreExercice)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {exercices.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Aucun exercice trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Exercices;
