import React, { useEffect, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBell } from "react-icons/fa";
import axios from "axios";
const API_URL = "http://127.0.0.1:5000";


const UserProfile = () => {
 const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setUpdatedUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const handleEditToggle = () => setEditMode(!editMode);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/userprofile/${user.role}/${user.iri}`, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil !");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre profil ?")) return;
    try {
      await axios.delete(`${API_URL}/userprofile/${user.role}/${user.iri}`);
      localStorage.removeItem("user");
      alert("Profil supprimé !");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du profil !");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Utilisateur non trouvé</p>;

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
      {/* Profil card */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "80px",
          marginLeft:"500px",
          width:"500px"
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            padding: "50px 40px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            animation: "fadeIn 0.7s ease-in-out",
          }}
        >
           <h2 style={{ color: "#222", fontWeight: "700", marginBottom: "20px" }}>
            Profil {user.nom} {user.prenom}
          </h2>

          {editMode ? (
            <div style={{ textAlign: "left" }}>
              <input
                type="text"
                className="form-control mb-2"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={updatedUser.adresse}
                onChange={(e) => setUpdatedUser({ ...updatedUser, adresse: e.target.value })}
                placeholder="Adresse"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={updatedUser.telephone}
                onChange={(e) => setUpdatedUser({ ...updatedUser, telephone: e.target.value })}
                placeholder="Téléphone"
              />
              <button className="btn btn-success w-100" onClick={handleSave}>
                💾 Sauvegarder
              </button>
              <button className="btn btn-secondary w-100 mt-2" onClick={handleEditToggle}>
                Annuler
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  textAlign: "left",
                  lineHeight: "1.8",
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "30px",
                }}
              >
               <p><strong>Email:</strong> {user.email}</p>
  <p><strong>Adresse:</strong> {user.adresse}</p>
  <p><strong>Téléphone:</strong> {user.telephone}</p>
  <p><strong>Rôle:</strong> {user.role}</p>
  <p><strong>Date Naissance:</strong> {user.dateNaissance}</p>

  {/* Affichage conditionnel selon le rôle */}
  {user.role?.toLowerCase() === "etudiant" && (
    <>
      <p><strong>Matricule:</strong> {user.matricule}</p>
      <p><strong>Niveau:</strong> {user.niveau}</p>
    </>
  )}

  {user.role?.toLowerCase() === "enseignant" && (
    <p><strong>Salaire:</strong> {user.salaire} TND</p>
  )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "15px" }}>
  <button
    className="btn btn-primary w-50"
    onClick={handleEditToggle}
    style={{ flex: 1 }}
  >
    ✏️ Modifier
  </button>
  <button
    className="btn btn-danger w-50"
    onClick={handleDelete}
    style={{ flex: 1 }}
  >
    🗑️ Supprimer
  </button>
</div>



              <button className="btn btn-dark w-100" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>  );
};

export default UserProfile;
