import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Examens = () => {
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
  const [examens, setExamens] = useState([]);
  const [form, setForm] = useState({ titreExamen: "", dateExamen: "", duree: "" });
  const [editMode, setEditMode] = useState(false);
  const [editTitre, setEditTitre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // --------- Récupérer tous les examens ----------
  const fetchExamens = async () => {
    try {
      const res = await axios.get(`${API_URL}/examens`);
      setExamens(res.data);
    } catch (err) {
      console.error("Erreur fetchExamens:", err);
    }
  };

  useEffect(() => {
    fetchExamens();
  }, []);

  // --------- Ajouter ou Modifier un examen ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titreExamen || !form.dateExamen || !form.duree) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/examens/${editTitre}`, form);
        setEditMode(false);
        setEditTitre("");
      } else {
        await axios.post(`${API_URL}/examens`, form);
      }
      setForm({ titreExamen: "", dateExamen: "", duree: "" });
      fetchExamens();
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    }
  };

  // --------- Supprimer un examen ----------
  const handleDelete = async (titreExamen) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet examen ?")) return;
    try {
      await axios.delete(`${API_URL}/examens/${titreExamen}`);
      fetchExamens();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };
   // --------- Rechercher un examen ----------
  const handleSearch = () => {
    const filtered = examens.filter((ex) =>
      ex.titreExamen.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExamens(filtered);
  };


  // --------- Préparer la modification ----------
  const handleEdit = (examen) => {
    setForm({
      titreExamen: examen.titreExamen,
      dateExamen: examen.dateExamen,
      duree: examen.duree,
    });
    setEditMode(true);
    setEditTitre(examen.titreExamen);
  };

  return (
    <>    {/* Navbar */}
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
      <h2>Gestion des Examens</h2>
 {/* Barre de recherche */}
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
            value={form.titreExamen}
            onChange={(e) => setForm({ ...form, titreExamen: e.target.value })}
            required
            disabled={editMode} // impossible de modifier le titre
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={form.dateExamen}
            onChange={(e) => setForm({ ...form, dateExamen: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Durée</label>
          <input
            type="text"
            className="form-control"
            value={form.duree}
            onChange={(e) => setForm({ ...form, duree: e.target.value })}
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
              setForm({ titreExamen: "", dateExamen: "", duree: "" });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* Liste des examens */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Durée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {examens.map((ex) => (
            <tr key={ex.titreExamen}>
              <td>{ex.titreExamen}</td>
              <td>{ex.dateExamen}</td>
              <td>{ex.duree}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(ex)}>Modifier</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ex.titreExamen)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {examens.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Aucun examen trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Examens;
