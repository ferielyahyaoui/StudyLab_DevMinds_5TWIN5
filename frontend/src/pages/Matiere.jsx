import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Matiere = () => {
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
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({ codeMatiere: "", nomMatiere: "", domaine: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");4
  const [searchTerm, setSearchTerm] = useState("");
const [filteredMatieres, setFilteredMatieres] = useState([]);


  const fetchMatieres = async () => {
    try {
      const res = await axios.get(`${API_URL}/matieres`);
      setMatieres(res.data);
      setFilteredMatieres(res.data); // copie pour filtrage
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);
const handleSearch = () => {
  const filtered = matieres.filter((m) =>
    m.nomMatiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codeMatiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredMatieres(filtered);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.codeMatiere || !form.nomMatiere || !form.domaine)
      return alert("Tous les champs sont requis !");
    try {
      if (editMode) {
        await axios.put(`${API_URL}/matieres/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/matieres`, form);
      }
      setForm({ codeMatiere: "", nomMatiere: "", domaine: "" });
      fetchMatieres();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (m) => {
    setForm(m);
    setEditMode(true);
    setEditId(m.codeMatiere);
  };

  const handleDelete = async (codeMatiere) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    try {
      await axios.delete(`${API_URL}/matieres/${codeMatiere}`);
      fetchMatieres();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 pt-5">
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
      <h2>Gestion des Matières</h2>
      {/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher par nom, code ou domaine..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="btn btn-outline-primary" type="button" onClick={handleSearch}>
    🔍 Search
  </button>
</div>


      <form onSubmit={handleSubmit} className="mb-4 shadow p-4 rounded bg-light">
        <input
          type="text"
          placeholder="Code Matière"
          className="form-control mb-2"
          value={form.codeMatiere}
          onChange={(e) => setForm({ ...form, codeMatiere: e.target.value })}
        />

        <input
          type="text"
          placeholder="Nom Matière"
          className="form-control mb-2"
          value={form.nomMatiere}
          onChange={(e) => setForm({ ...form, nomMatiere: e.target.value })}
        />

        <select
          className="form-select mb-3"
          value={form.domaine}
          onChange={(e) => setForm({ ...form, domaine: e.target.value })}
        >
          <option value="">-- Sélectionnez un domaine --</option>
          <option value="scientifique">Scientifique</option>
          <option value="litteraire">Littéraire</option>
          <option value="economique">Économique</option>
          <option value="art_culture">Art et Culture</option>
        </select>

        <button className="btn btn-primary">{editMode ? "Modifier" : "Ajouter"}</button>
        {editMode && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditMode(false);
              setForm({ codeMatiere: "", nomMatiere: "", domaine: "" });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Domaine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMatieres.map((m) => (
            <tr key={m.codeMatiere}>
              <td>{m.codeMatiere}</td>
              <td>{m.nomMatiere}</td>
              <td>{m.domaine}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(m)}>
                  Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.codeMatiere)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {matieres.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                Aucune matière trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Matiere;
