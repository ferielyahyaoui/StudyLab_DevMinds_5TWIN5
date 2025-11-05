import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Institution = () => {
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
  const [institutions, setInstitutions] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    nomInstitution: "",
    Ville: "",
    adresseInstitution: "",
    adressemail: "",
    telephoneInstitution: "",
    anneeCreation: "",
    description: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [filteredInstitutions, setFilteredInstitutions] = useState([]);

  // 🔹 Récupérer toutes les institutions
  const fetchInstitutions = async () => {
    try {
      const res = await axios.get(`${API_URL}/institutions`);
     setInstitutions(res.data);
    setFilteredInstitutions(res.data); // ✅ garde une copie filtrable
    } catch (err) {
      console.error("Erreur fetchInstitutions:", err);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);
const handleSearch = () => {
  const filtered = institutions.filter((i) =>
    i.nomInstitution.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredInstitutions(filtered);
};

  // 🔹 Ajouter ou modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomInstitution.trim()) {
      return alert("Le nom de l'institution est requis !");
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/institutions/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/institutions`, form);
      }
      setForm({
        nom: "",
        nomInstitution: "",
        Ville: "",
        adresseInstitution: "",
        adressemail: "",
        telephoneInstitution: "",
        anneeCreation: "",
        description: ""
      });
      fetchInstitutions();
    } catch (err) {
      console.error("Erreur handleSubmit:", err.response?.data || err.message);
    }
  };

  // 🔹 Préparer la modification
  const handleEdit = (i) => {
    setForm({ ...i });
    setEditMode(true);
    setEditId(i.nomInstitution);
  };

  // 🔹 Supprimer
  const handleDelete = async (nomInstitution) => {
    if (!window.confirm("Supprimer cette institution ?")) return;
    try {
      await axios.delete(`${API_URL}/institutions/${nomInstitution}`);
      fetchInstitutions();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
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
      <h2>Gestion des Institutions</h2>
{/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher une institution..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="btn btn-outline-primary" onClick={handleSearch}>
    🔍 Search
  </button>
</div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nom Institution</label>
          <input
            type="text"
            className="form-control"
            value={form.nomInstitution}
            onChange={(e) => setForm({ ...form, nomInstitution: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ville</label>
          <input
            type="text"
            className="form-control"
            value={form.Ville}
            onChange={(e) => setForm({ ...form, Ville: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Adresse</label>
          <input
            type="text"
            className="form-control"
            value={form.adresseInstitution}
            onChange={(e) => setForm({ ...form, adresseInstitution: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.adressemail}
            onChange={(e) => setForm({ ...form, adressemail: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input
            type="text"
            className="form-control"
            value={form.telephoneInstitution}
            onChange={(e) => setForm({ ...form, telephoneInstitution: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Année de création</label>
          <input
            type="text"
            className="form-control"
            value={form.anneeCreation}
            onChange={(e) => setForm({ ...form, anneeCreation: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">{editMode ? "Modifier" : "Ajouter"}</button>
        {editMode && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditMode(false);
              setEditId("");
              setForm({
                nom: "",
                nomInstitution: "",
                Ville: "",
                adresseInstitution: "",
                adressemail: "",
                telephoneInstitution: "",
                anneeCreation: "",
                description: ""
              });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* Table des institutions */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nom Institution</th>
            <th>Ville</th>
            <th>Adresse</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Année</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((i) => (
            <tr key={i.nomInstitution}>
              <td>{i.nom}</td>
              <td>{i.nomInstitution}</td>
              <td>{i.Ville}</td>
              <td>{i.adresseInstitution}</td>
              <td>{i.adressemail}</td>
              <td>{i.telephoneInstitution}</td>
              <td>{i.anneeCreation}</td>
              <td>{i.description}</td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => handleEdit(i)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.nomInstitution)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {institutions.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">Aucune institution trouvée</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Institution;
