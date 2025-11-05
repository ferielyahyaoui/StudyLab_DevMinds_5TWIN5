import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Note = () => {
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
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    dateEvaluation: "",
    noteMax: "",
    typeEvaluation: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [filteredNotes, setFilteredNotes] = useState([]);


  // 🟢 Récupérer toutes les notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data);
      setFilteredNotes(res.data); // copie pour filtrage
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
  const filtered = notes.filter((n) =>
    n.typeEvaluation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.dateEvaluation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.noteMax.toString().includes(searchTerm)
  );
  setFilteredNotes(filtered);
};


  useEffect(() => {
    fetchNotes();
  }, []);

  // 🟢 Ajouter ou modifier une note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.dateEvaluation || !form.noteMax || !form.typeEvaluation)
      return alert("Tous les champs sont requis");

    try {
      if (editMode) {
        await axios.put(`${API_URL}/notes/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/notes`, form);
      }

      setForm({ dateEvaluation: "", noteMax: "", typeEvaluation: "" });
      fetchNotes();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🟢 Préparer l'édition
  const handleEdit = (n) => {
    setForm(n);
    setEditMode(true);
    setEditId(n.dateEvaluation);
  };

  // 🟢 Supprimer une note
  const handleDelete = async (dateEvaluation) => {
    if (!window.confirm("Supprimer cette note ?")) return;
    try {
      await axios.delete(`${API_URL}/notes/${dateEvaluation}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
     {/* Navbar */}
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
      <h2 className="text-center mb-4">Gestion des Notes</h2>
      {/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher par type, date ou note..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="btn btn-outline-primary" type="button" onClick={handleSearch}>
    🔍 Rechercher
  </button>
</div>


      {/* 🔹 Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4 shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label fw-bold">Date d’évaluation</label>
          <input
            type="date"
            className="form-control"
            value={form.dateEvaluation}
            onChange={(e) =>
              setForm({ ...form, dateEvaluation: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Note maximale</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="Note max"
            value={form.noteMax}
            onChange={(e) =>
              setForm({ ...form, noteMax: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Type d’évaluation</label>
          <select
            className="form-select"
            value={form.typeEvaluation}
            onChange={(e) =>
              setForm({ ...form, typeEvaluation: e.target.value })
            }
          >
            <option value="">-- Sélectionnez un type --</option>
            <option value="test">Test</option>
            <option value="quiz">Quiz</option>
            <option value="examen">Examen</option>
            <option value="projet">Projet</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">
          {editMode ? "Modifier la note" : "Ajouter une note"}
        </button>
      </form>

      {/* 🔹 Tableau d’affichage */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark text-center">
          <tr>
            <th>Date</th>
            <th>Note max</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Aucune note disponible.
              </td>
            </tr>
          ) : (
            filteredNotes.map((n) => (
              <tr key={n.dateEvaluation}>
                <td>{n.dateEvaluation}</td>
                <td>{n.noteMax}</td>
                <td>{n.typeEvaluation}</td>
                <td className="text-center">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(n)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(n.dateEvaluation)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Note;
