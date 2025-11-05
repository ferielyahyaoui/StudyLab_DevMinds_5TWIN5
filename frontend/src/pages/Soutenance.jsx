import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Soutenance = () => {
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
  
  const [soutenances, setSoutenances] = useState([]);
const [form, setForm] = useState({ nomEtudiant: "", dateSoutenance: "", noteSoutenance: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [filteredSoutenances, setFilteredSoutenances] = useState([]);

  // 🔹 Récupérer toutes les soutenances
 const fetchSoutenances = async () => {
  try {
    const res = await axios.get(`${API_URL}/soutenances`);
    setSoutenances(res.data);
    setFilteredSoutenances(res.data); // ✅ met à jour la liste affichée
  } catch (err) {
    console.error("Erreur fetchSoutenances:", err);
  }
};
const handleSearch = () => {
  const filtered = soutenances.filter(
    (s) =>
      s.dateSoutenance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.noteSoutenance.toString().includes(searchTerm)
  );
  setFilteredSoutenances(filtered);
};


  useEffect(() => {
    fetchSoutenances();
  }, []);

  // 🔹 Ajouter ou modifier une soutenance
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomEtudiant.trim()) {
  return alert("Le nom de l'étudiant est requis !");
}

    if (!form.dateSoutenance.trim() || form.noteSoutenance === "") {
      return alert("Tous les champs sont requis !");
    }

    // Convertir la note en nombre
    const payload = {
  nomEtudiant: form.nomEtudiant.trim(),
  dateSoutenance: form.dateSoutenance,
  noteSoutenance: parseFloat(form.noteSoutenance),
};


    try {
      if (editMode) {
        await axios.put(`${API_URL}/soutenances/${editId}`, payload);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/soutenances`, payload);
      }
      setForm({ dateSoutenance: "", noteSoutenance: "" });
      fetchSoutenances();
    } catch (err) {
      console.error("Erreur handleSubmit:", err.response?.data || err.message);
    }
  };

  // 🔹 Préparer la modification
  const handleEdit = (s) => {
    setForm({
      dateSoutenance: s.dateSoutenance,
      noteSoutenance: s.noteSoutenance.toString(),
    });
    setEditMode(true);
    setEditId(s.dateSoutenance);
  };

  // 🔹 Supprimer une soutenance
  const handleDelete = async (dateSoutenance) => {
    if (!window.confirm("Supprimer cette soutenance ?")) return;
    try {
      await axios.delete(`${API_URL}/soutenances/${dateSoutenance}`);
      fetchSoutenances();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  return (
    <>
      {/* 🔹 Navbar */}
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

      {/* 🔹 Contenu */}
      <div className="container mt-5 pt-5">
        <h2>Gestion des Soutenances</h2>
{/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher une soutenance (date ou note)..."
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
            <label className="form-label">Date de Soutenance</label>
            <input
              type="date"
              className="form-control"
              value={form.dateSoutenance}
              onChange={(e) => setForm({ ...form, dateSoutenance: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
  <label className="form-label">Nom de l'Étudiant</label>
  <input
    type="text"
    className="form-control"
    placeholder="Entrez le nom de l'étudiant"
    value={form.nomEtudiant}
    onChange={(e) => setForm({ ...form, nomEtudiant: e.target.value })}
    required
  />
</div>

          <div className="mb-3">
            <label className="form-label">Note de Soutenance</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={form.noteSoutenance}
              onChange={(e) => setForm({ ...form, noteSoutenance: e.target.value })}
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
                setEditId("");
                setForm({ dateSoutenance: "", noteSoutenance: "" });
              }}
            >
              Annuler
            </button>
          )}
        </form>

        {/* Table des soutenances */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Note</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {soutenances.length > 0 ? soutenances.map((s) => (
              <tr key={s.dateSoutenance}>
                <td>{s.dateSoutenance}</td>
                <td>{s.noteSoutenance}</td>

                <td>
                  <button className="btn btn-warning me-2 btn-sm" onClick={() => handleEdit(s)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.dateSoutenance)}>Supprimer</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="text-center">Aucune soutenance trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Soutenance;
