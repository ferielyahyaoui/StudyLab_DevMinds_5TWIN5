import React, { useState } from "react";

const SignUp = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("Etudiant"); // Par défaut
  const [matricule, setMatricule] = useState("");
  const [niveau, setNiveau] = useState("");
  const [salaire, setSalaire] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Construire le payload selon le rôle
  const payload = {
    nom,
    prenom,
    email,
    adresse,
    dateNaissance,
    motdepasse,
    telephone,
    role,
    matricule: role === "Etudiant" ? (matricule || "") : "",
    niveau: role === "Etudiant" ? (niveau || "") : "",
    salaire: role === "Enseignant" ? (salaire ? parseFloat(salaire) : 0) : 0,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Erreur lors de l'inscription");
    }

    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    window.location.href = "/signin"; // Redirection
  } catch (error) {
    alert("Erreur : " + error.message);
  }
};


  return (
    <>
      {/* 🔹 Header / Navbar */}
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

          <ul className="navbar-nav d-flex flex-row mb-0">
            <li className="nav-item mx-2">
              <a href="/" className="nav-link text-white">Home</a>
            </li>
            <li className="nav-item mx-2">
              <a href="/about" className="nav-link text-white">About</a>
            </li>
            <li className="nav-item mx-2">
              <a href="/course" className="nav-link text-white">Course</a>
            </li>
            <li className="nav-item mx-2">
              <a href="/signin" className="nav-link text-white active">Sign In</a>
            </li>
          </ul>
        </div>
      </nav> 

      {/* 🔹 Section principale */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "80px",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          marginLeft:"500px" // pour éviter que le header cache le contenu
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            padding: "60px 50px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            animation: "fadeIn 0.7s ease-in-out",
            
          }}
        >
        

          <h3 style={{ color: "#222", fontWeight: "700", marginBottom: "10px" }}>
            Sign Up for Smart Education
          </h3>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Create your account to access courses and resources
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            {/* Champ Rôle */}
            <div className="form-group mb-3">
              <label>Rôle</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc" }}
              >
                <option value="Etudiant">Étudiant</option>
                <option value="Enseignant">Enseignant</option>
              </select>
            </div>

            {/* Champs communs */}
            <div className="form-group mb-3">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                className="form-control"
                placeholder="Votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                className="form-control"
                placeholder="Votre prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="adresse">Adresse</label>
              <input
                type="text"
                id="adresse"
                className="form-control"
                placeholder="Votre adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="dateNaissance">Date de naissance</label>
              <input
                type="date"
                id="dateNaissance"
                className="form-control"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="motdepasse">Mot de passe</label>
              <input
                type="password"
                id="motdepasse"
                className="form-control"
                placeholder="••••••••"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                className="form-control"
                placeholder="0123456789"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
              />
            </div>

            {/* Champs spécifiques */}
            {role === "Etudiant" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="matricule">Matricule</label>
                  <input
                    type="text"
                    id="matricule"
                    className="form-control"
                    placeholder="E001"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    required
                    style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="niveau">Niveau</label>
                  <select
                    id="niveau"
                    className="form-control"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    required
                    style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc" }}
                  >
                    <option value="">Choisir...</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </select>
                </div>
              </>
            )}

            {role === "Enseignant" && (
              <div className="form-group mb-3">
                <label htmlFor="salaire">Salaire (annuel)</label>
                <input
                  type="number"
                  id="salaire"
                  className="form-control"
                  placeholder="50000"
                  value={salaire}
                  onChange={(e) => setSalaire(e.target.value)}
                  style={{ borderRadius: "10px", padding: "12px", border: "1px solid #ccc", width: "100%" }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Register
            </button>
          </form>

          <p style={{ color: "#777", marginTop: "25px" }}>
            Already have an account?{" "}
            <a
              href="/signin"
              style={{ color: "#2575fc", textDecoration: "none", fontWeight: "500" }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default SignUp;