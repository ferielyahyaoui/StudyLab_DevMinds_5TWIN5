import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Chapitres = () => {
  const [user, setUser] = useState(null);
  const [chapitres, setChapitres] = useState([]);
  const [form, setForm] = useState({ numeroChapitre: "", titreChapitre: "" });
  const [editMode, setEditMode] = useState(false);
  const [editNumero, setEditNumero] = useState("");

  // Récupérer utilisateur connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Récupérer tous les chapitres
  const fetchChapitres = async () => {
    try {
      const res = await axios.get(`${API_URL}/chapitres`);
      setChapitres(res.data);
    } catch (err) {
      console.error("Erreur fetchChapitres:", err);
    }
  };

  useEffect(() => {
    fetchChapitres();
  }, []);

  // Ajouter ou Modifier un chapitre
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.numeroChapitre || !form.titreChapitre) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/chapitres/${editNumero}`, form);
        setEditMode(false);
        setEditNumero("");
      } else {
        await axios.post(`${API_URL}/chapitres`, form);
      }
      setForm({ numeroChapitre: "", titreChapitre: "" });
      fetchChapitres();
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    }
  };

  // Supprimer un chapitre
  const handleDelete = async (numeroChapitre) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce chapitre ?")) return;
    try {
      await axios.delete(`${API_URL}/chapitres/${numeroChapitre}`);
      fetchChapitres();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  // Préparer la modification
  const handleEdit = (chapitre) => {
    setForm({
      numeroChapitre: chapitre.numeroChapitre,
      titreChapitre: chapitre.titreChapitre,
    });
    setEditMode(true);
    setEditNumero(chapitre.numeroChapitre);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <>
      {/* 🔹 Navbar identique */}
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

      {/* 🔹 Contenu principal */}
      <div className="container mt-5 pt-5">
        <h2>Gestion des Chapitres</h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Numéro Chapitre</label>
            <input
              type="text"
              className="form-control"
              value={form.numeroChapitre}
              onChange={(e) => setForm({ ...form, numeroChapitre: e.target.value })}
              required
              disabled={editMode}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Titre Chapitre</label>
            <input
              type="text"
              className="form-control"
              value={form.titreChapitre}
              onChange={(e) => setForm({ ...form, titreChapitre: e.target.value })}
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
                setEditNumero("");
                setForm({ numeroChapitre: "", titreChapitre: "" });
              }}
            >
              Annuler
            </button>
          )}
        </form>

        {/* Tableau */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Numéro Chapitre</th>
              <th>Titre Chapitre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapitres.map((ch) => (
              <tr key={ch.numeroChapitre}>
                <td>{ch.numeroChapitre}</td>
                <td>{ch.titreChapitre}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(ch)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ch.numeroChapitre)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {chapitres.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">Aucun chapitre trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Chapitres;
