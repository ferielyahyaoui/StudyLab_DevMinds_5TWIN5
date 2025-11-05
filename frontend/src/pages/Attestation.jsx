import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

const Attestation = () => {
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
  const [attestations, setAttestations] = useState([]);
  const [form, setForm] = useState({
    nomEtudiant: "",
    titreAttestation: "",
    dateObtention: "",
    organisme: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAttestations, setFilteredAttestations] = useState([]);


  // 🔹 Charger les attestations
  const fetchAttestations = async () => {
    try {
      const res = await axios.get(`${API_URL}/attestations`);
      setAttestations(res.data);
      setFilteredAttestations(res.data); // copie pour filtrage local

    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
  const filtered = attestations.filter((a) =>
    a.nomEtudiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.titreAttestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.organisme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dateObtention.toString().includes(searchTerm)
  );
  setFilteredAttestations(filtered);
};

  useEffect(() => {
    fetchAttestations();
  }, []);

  // 🔹 Ajouter ou modifier une attestation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nomEtudiant ||
      !form.titreAttestation ||
      !form.dateObtention ||
      !form.organisme
    )
      return alert("Tous les champs sont requis");

    try {
      if (editMode) {
        await axios.put(`${API_URL}/attestations/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/attestations`, form);
      }

      setForm({
        nomEtudiant: "",
        titreAttestation: "",
        dateObtention: "",
        organisme: "",
      });
      fetchAttestations();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Préparer édition
  const handleEdit = (a) => {
    setForm(a);
    setEditMode(true);
    setEditId(a.titreAttestation);
  };

  // 🔹 Supprimer une attestation
  const handleDelete = async (titreAttestation) => {
    if (!window.confirm("Supprimer cette attestation ?")) return;
    try {
      await axios.delete(`${API_URL}/attestations/${titreAttestation}`);
      fetchAttestations();
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
      <h2 className=" mb-4"> Gestion des Attestations</h2>
{/* 🔍 Barre de recherche */}
<div className="d-flex mb-4">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Rechercher par nom, titre, organisme ou date..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button
    className="btn btn-outline-primary"
    type="button"
    onClick={handleSearch}
  >
    🔍 Rechercher
  </button>
</div>

      {/* 🧾 Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4 shadow p-4 rounded bg-light">
        {/* 🔹 Nom de l’étudiant */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nom de l’étudiant"
          value={form.nomEtudiant}
          onChange={(e) => setForm({ ...form, nomEtudiant: e.target.value })}
        />

        {/* 🔹 Titre */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Titre de l’attestation"
          value={form.titreAttestation}
          onChange={(e) =>
            setForm({ ...form, titreAttestation: e.target.value })
          }
        />

        {/* 🔹 Date */}
        <input
          type="date"
          className="form-control mb-2"
          value={form.dateObtention}
          onChange={(e) =>
            setForm({ ...form, dateObtention: e.target.value })
          }
        />

        {/* 🔹 Organisme */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Organisme"
          value={form.organisme}
          onChange={(e) => setForm({ ...form, organisme: e.target.value })}
        />

        {/* 🔹 Boutons */}
        <div className="d-flex justify-content-center">
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
                  titreAttestation: "",
                  dateObtention: "",
                  organisme: "",
                });
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* 🧾 Tableau */}
      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Organisme</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttestations.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-muted">
                Aucune attestation trouvée
              </td>
            </tr>
          ) : (
            attestations.map((a) => (
              <tr key={a.titreAttestation}>
                <td>{a.titreAttestation}</td>
                <td>{a.dateObtention}</td>
                <td>{a.organisme}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(a)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.titreAttestation)}
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
    

  );
};

export default Attestation;
