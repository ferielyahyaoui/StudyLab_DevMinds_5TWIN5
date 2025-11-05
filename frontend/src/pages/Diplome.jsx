import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Diplome = () => {
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
  const [diplomes, setDiplomes] = useState([]);
  const [form, setForm] = useState({ typeDiplome: "", anneObtention: "", mention: "", nomEtudiant: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState({ typeDiplome: "", anneObtention: "",nomEtudiant: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDiplomes, setFilteredDiplomes] = useState([]);

  const fetchDiplomes = async () => {
    try {
      const res = await axios.get(`${API_URL}/diplomes`);
      setDiplomes(res.data);
      setFilteredDiplomes(res.data); // copie pour le filtrage

    } catch (err) {
      console.error(err);
    }
  };

 const handleSearch = () => {
  const filtered = diplomes.filter((d) =>
    d.typeDiplome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mention.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nomEtudiant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.anneObtention.toString().includes(searchTerm)
  );
  setFilteredDiplomes(filtered);
};



  useEffect(() => {
    fetchDiplomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.typeDiplome || !form.anneObtention || !form.mention) return alert("Tous les champs sont requis");
    try {
      if (editMode) {
        await axios.put(`${API_URL}/diplomes/${editId.typeDiplome}/${editId.anneObtention}`, form);
        setEditMode(false);
        setEditId({ typeDiplome: "", anneObtention: "" });
      } else {
        await axios.post(`${API_URL}/diplomes`, form);
      }
      setForm({ typeDiplome: "", anneObtention: "", mention: "" });
      fetchDiplomes();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (d) => {
    setForm(d);
    setEditMode(true);
    setEditId({ typeDiplome: d.typeDiplome, anneObtention: d.anneObtention });
  };

  const handleDelete = async (typeDiplome, anneObtention) => {
    if (!window.confirm("Supprimer ce diplôme ?")) return;
    try {
      await axios.delete(`${API_URL}/diplomes/${typeDiplome}/${anneObtention}`);
      fetchDiplomes();
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
      <h2>Gestion des Diplômes</h2>
   {/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher par nom, type, mention ou année..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="btn btn-outline-primary" type="button" onClick={handleSearch}>
    🔍 Rechercher
  </button>
</div>

     <form onSubmit={handleSubmit} className="mb-4 shadow p-4 rounded bg-light">
  {/* 🔹 Nom de l’étudiant */}
  <input
    type="text"
    placeholder="Nom de l’étudiant"
    className="form-control mb-2"
    value={form.nomEtudiant || ""}
    onChange={(e) => setForm({ ...form, nomEtudiant: e.target.value })}
  />

  {/* 🔹 Type de diplôme */}
  <select
    className="form-select mb-2"
    value={form.typeDiplome}
    onChange={(e) => setForm({ ...form, typeDiplome: e.target.value })}
  >
    <option value="">-- Sélectionnez le type de diplôme --</option>
    <option value="bac">Baccalauréat</option>
    <option value="licence">Licence / Bachelor</option>
    <option value="master">Master</option>
    <option value="doctorat">Doctorat / PhD</option>
    <option value="ingenieur">Diplôme d’ingénieur</option>
    <option value="dut">DUT</option>
    <option value="bts">BTS</option>
    <option value="certificat">Certificat</option>
    <option value="formation_continue">Formation continue</option>
    <option value="autre">Autre</option>
  </select>

  {/* 🔹 Année d’obtention */}
  <input
    type="number"
    placeholder="Année d'obtention"
    className="form-control mb-2"
    value={form.anneObtention}
    onChange={(e) => setForm({ ...form, anneObtention: e.target.value })}
  />

  {/* 🔹 Mention */}
  <input
    type="text"
    placeholder="Mention"
    className="form-control mb-2"
    value={form.mention}
    onChange={(e) => setForm({ ...form, mention: e.target.value })}
  />

  {/* 🔹 Boutons */}
  <button className="btn btn-primary">
    {editMode ? "Modifier" : "Ajouter"}
  </button>
  {editMode && (
    <button
      type="button"
      className="btn btn-secondary ms-2"
      onClick={() => {
        setEditMode(false);
        setForm({
          nomEtudiant: "",
          typeDiplome: "",
          anneObtention: "",
          mention: "",
        });
      }}
    >
      Annuler
    </button>
  )}
</form>


      <table className="table table-bordered">
        <thead><tr><th>Type</th><th>Année</th><th>Mention</th><th>Actions</th></tr></thead>
        <tbody>
          {filteredDiplomes.map(d => (
            <tr key={`${d.typeDiplome}-${d.anneObtention}`}>
              <td>{d.typeDiplome}</td>
              <td>{d.anneObtention}</td>
              <td>{d.mention}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(d)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.typeDiplome, d.anneObtention)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {diplomes.length === 0 && <tr><td colSpan="4" className="text-center">Aucun diplôme trouvé</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Diplome;
