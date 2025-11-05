import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";


const API_URL = "http://127.0.0.1:5000";

const Notifications = () => {
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // 🔴 nombre de notifications non lues

  const [form, setForm] = useState({
    contenuNotification: "",
    dateEnvoi: "",
    typeNotification: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  // 🔹 Charger les notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/notifications");
      const data = res.data;
      // Supposons que chaque notif a un champ "lu": true/false
      const newOnes = data.filter((n) => n.lu === false);
      setUnreadCount(newOnes.length);
    } catch (err) {
      console.error("Erreur chargement notifications :", err);
    }
  };

  if (user && user.role === "Etudiant") {
    fetchUnreadCount();
  }
}, [user]);


  // 🔹 Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contenuNotification || !form.dateEnvoi || !form.typeNotification)
      return alert("Tous les champs sont requis !");
    try {
      if (editMode) {
        await axios.put(`${API_URL}/notifications/${editId}`, form);
        setEditMode(false);
        setEditId("");
      } else {
        await axios.post(`${API_URL}/notifications`, form);
      }
      setForm({ contenuNotification: "", dateEnvoi: "", typeNotification: "" });
      fetchNotifications();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Éditer
  const handleEdit = (n) => {
    setForm(n);
    setEditMode(true);
    setEditId(n.dateEnvoi);
  };

  // 🔹 Supprimer
  const handleDelete = async (dateEnvoi) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    try {
      await axios.delete(`${API_URL}/notifications/${dateEnvoi}`);
      fetchNotifications();
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
                                                      <li className="nav-item mx-3 position-relative">
  <a
    href="/notifications"
    className="nav-link text-white d-flex align-items-center position-relative"
    style={{ fontSize: "1.4rem" }}
  >
    <FaBell />

    {/* 🔴 Badge rouge visible si unreadCount > 0 */}
    {unreadCount > 0 && (
      <span
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        style={{
          fontSize: "0.65rem",
          padding: "4px 6px",
          transform: "translate(-40%, 10%)",
        }}
      >
        {unreadCount}
      </span>
    )}
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
      <h2 className="mb-4 text-center">Gestion des Notifications</h2>

      {/* Formulaire */}
      {user && user.role === "Enseignant" ? (

      <form onSubmit={handleSubmit} className="mb-4 shadow p-4 rounded bg-light">
        <textarea
          className="form-control mb-2"
          placeholder="Contenu de la notification"
          value={form.contenuNotification}
          onChange={(e) => setForm({ ...form, contenuNotification: e.target.value })}
          required
        />

        <label>Date d’envoi :</label>
        <input
          type="date"
          className="form-control mb-2"
          value={form.dateEnvoi}
          onChange={(e) => setForm({ ...form, dateEnvoi: e.target.value })}
          required
        />

        <label>Type de notification :</label>
        <select
          className="form-select mb-3"
          value={form.typeNotification}
          onChange={(e) => setForm({ ...form, typeNotification: e.target.value })}
          required
        >
          <option value="">-- Sélectionnez le type --</option>
          <option value="information">Annonce cours</option>
          <option value="rappel">Rappel Devoir</option>
          <option value="système">Message Système</option>
        </select>

        <div>
          <button className="btn btn-primary">
            {editMode ? "Modifier" : "Ajouter"}
          </button>
          {editMode && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditMode(false);
                setForm({ contenuNotification: "", dateEnvoi: "", typeNotification: "" });
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
      ) : (
     <div className="alert alert-info">
    Vous devez être connecté en tant qu’<strong>enseignant</strong> pour gérer les examens.
  </div>
)}


      {/* Tableau des notifications */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark text-center">
          <tr>
            <th>Contenu</th>
            <th>Date d’envoi</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n.dateEnvoi}>
              <td>{n.contenuNotification}</td>
              <td>{n.dateEnvoi}</td>
              <td>{n.typeNotification}</td>
              <td className="text-center">

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(n)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(n.dateEnvoi)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {notifications.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Aucune notification trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
