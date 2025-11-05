import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Devoir = () => {
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
  const [devoirs, setDevoirs] = useState([]);
  const [form, setForm] = useState({ titreDevoir: "", consigne: "", dateSoumission: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [filteredDevoirs, setFilteredDevoirs] = useState([]);

const fetchDevoirs = async () => {
  try {
    const res = await axios.get(`${API_URL}/devoirs`);
    setDevoirs(res.data);
    setFilteredDevoirs(res.data); // ✅ met la liste filtrée à jour
  } catch (err) {
    console.error("Erreur fetchDevoirs:", err);
  }
};
const handleSearch = () => {
  const filtered = devoirs.filter((d) =>
    d.titreDevoir.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredDevoirs(filtered);
};


  useEffect(() => {
    fetchDevoirs();
  }, []);

  // 🔹 Ajouter ou modifier un devoir
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titreDevoir.trim() || !form.consigne.trim() || !form.dateSoumission.trim()) {
      return alert("Tous les champs sont requis !");
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/devoirs/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/devoirs`, form);
      }
      setForm({ titreDevoir: "", consigne: "", dateSoumission: "" });
      fetchDevoirs();
    } catch (err) {
      console.error("Erreur handleSubmit:", err.response?.data || err.message);
    }
  };

  // 🔹 Préparer la modification
  const handleEdit = (devoir) => {
    setForm({
      titreDevoir: devoir.titreDevoir,
      consigne: devoir.consigne,
      dateSoumission: devoir.dateSoumission,
    });
    setEditMode(true);
    setEditId(devoir.titreDevoir);
  };

  // 🔹 Supprimer un devoir
  const handleDelete = async (titreDevoir) => {
    if (!window.confirm("Supprimer ce devoir ?")) return;
    try {
      await axios.delete(`${API_URL}/devoirs/${titreDevoir}`);
      fetchDevoirs();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  // Fonction pour générer la consigne via Gemini
const generateConsigneGemini = async () => {
  if (!form.titreDevoir.trim()) return alert("Veuillez entrer un titre de devoir.");
  try {
   const res = await axios.post(`${API_URL}/generate_consigne_local`, {
  titreDevoir: form.titreDevoir,
});

    if (res.data.consigne) {
      setForm((prev) => ({ ...prev, consigne: res.data.consigne }));
    }
  } catch (err) {
    console.error("Erreur génération consigne:", err);
    alert("Erreur lors de la génération de la consigne.");
  }
};

const handleGenerateConsigne = async () => {
  try {
   const res = await axios.post("http://127.0.0.1:5000/generate_consigne_local", {
  titreDevoir: form.titreDevoir
});

    setForm({ ...form, consigne: res.data.consigne });
  } catch (err) {
    console.error("Erreur génération consigne:", err);
    alert("Erreur lors de la génération de la consigne !");
  }
};

  return (
    <>
      {/* 🔹 Navbar identique à CoursEnLigne */}
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
        <h2>Gestion des Devoirs</h2>
        {/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher un devoir par titre..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="btn btn-outline-primary" onClick={handleSearch}>
    🔍 Search
  </button>
</div>


        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mb-4">
          
    <div className="mb-3 d-flex align-items-center">
  <div className="flex-grow-1 me-2">
    <label className="form-label">Titre du Devoir</label>
    <input
      type="text"
      className="form-control"
      value={form.titreDevoir}
      onChange={(e) => setForm({ ...form, titreDevoir: e.target.value })}
      required
    />
  </div>
  <button
    type="button"
    className="btn btn-outline-secondary mt-4"
    onClick={generateConsigneGemini}
  >
    ✨ Générer consigne
  </button>
</div>

          <div className="mb-3">
            
            <label className="form-label">Consigne</label>
            <textarea
              className="form-control"
              value={form.consigne}
              onChange={(e) => setForm({ ...form, consigne: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Date de Soumission</label>
            <input
              type="date"
              className="form-control"
              value={form.dateSoumission}
              onChange={(e) => setForm({ ...form, dateSoumission: e.target.value })}
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
                setForm({ titreDevoir: "", consigne: "", dateSoumission: "" });
              }}
            >
              Annuler
            </button>
          )}
        </form>

        {/* Table des devoirs */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Consigne</th>
              <th>Date de Soumission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevoirs.map((d) => (
              <tr key={d.titreDevoir}>
                <td>{d.titreDevoir}</td>
                <td>{d.consigne}</td>
                <td>{d.dateSoumission}</td>
                <td>
                  <button className="btn btn-warning me-2 btn-sm" onClick={() => handleEdit(d)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.titreDevoir)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {devoirs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Aucun devoir trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Devoir;
