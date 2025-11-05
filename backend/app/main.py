from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,EmailStr
from typing import List
from app.models import UserSignup, UserSignin
from app.sparql_client import run_select, run_update
from app.auth import hash_password, verify_password
import os
from dotenv import load_dotenv
from email.message import EmailMessage
import smtplib
from passlib.context import CryptContext
import random, string, time
from fastapi import FastAPI, Request


import requests


import hashlib

#API GEMINI
API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY", "AIzaSyBzRcmHm9YHa9U90e2-K25sVCpVyGsF4Z4")

MODEL = "gemini-1.5-flash"  # ou "gemini-1.5-pro"

# Configuration SMTP (change pour ton email)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER", "ferielyahyaouiii@gmail.com")
SMTP_PASS = os.getenv("SMTP_PASS", "ncrxnjxzplummhjp")

load_dotenv()

PREFIX = f"""
PREFIX : <{os.getenv('ONTOLOGY_PREFIX')}>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
"""

app = FastAPI(title="SmartEducation API")

# Autoriser ton React sur le port 5173
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "API OK"}





# ---------------- SIGN UP ----------------
@app.post("/signup")
def signup(user: UserSignup):
    # Validation minimale
    if not user.motdepasse or user.motdepasse.strip() == "":
        raise HTTPException(status_code=400, detail="Mot de passe obligatoire")

    # Vérifier si email existe (si email vide, on ne vérifie pas)
    if user.email:
        check_query = PREFIX + f'ASK {{ ?u :Email "{user.email}" }}'
        try:
            exists = run_select(check_query).get("boolean", False)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur SPARQL (ASK): {str(e)}")
        if exists:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    # IRI unique (éviter caractères problématiques)
    safe_name = (user.nom or "user").strip().replace(" ", "_")
    email_part = (user.email.split("@")[0] if user.email else safe_name).replace(".", "_").replace("-", "_")
    slug = f"{user.role.lower()}_{email_part}"

    # Hash simple (SHA-256)
    hashed = hash_password(user.motdepasse)

    # Construire triples en forçant présence de tous les champs (texte vides -> "")
    # dateNaissance doit rester formaté si vide on met ""^^xsd:date provoque erreur -> on met "" sans xsd si vide
    date_triple = f'"{user.dateNaissance}"^^xsd:date' if user.dateNaissance else '""'

    # salaire : nombre ou 0
    salaire_val = user.salaire if user.salaire is not None else 0

    triples = f"""
:{slug} a :{user.role} ;
       :Nom "{(user.nom or '')}" ;
       :Prénom "{(user.prenom or '')}" ;
       :Email "{(user.email or '')}" ;
       :adresse "{(user.adresse or '')}" ;
       :dateNaissance {date_triple} ;
       :motdepasse "{hashed}" ;
       :telephone "{(user.telephone or '')}" ;
       :matricule "{(user.matricule or '')}" ;
       :niveau "{(user.niveau or '')}" ;
       :salaire {salaire_val} .
"""

    update_query = PREFIX + f"INSERT DATA {{ {triples} }}"

    try:
        run_update(update_query)
        return {"message": "Inscription réussie !", "iri": slug}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'insertion SPARQL: {str(e)}")

# ---------------- SIGN IN ----------------
# ---------------- SIGN IN ----------------
@app.post("/signin")
def signin(user: UserSignin):
    if not user.email or not user.motdepasse:
        raise HTTPException(status_code=400, detail="Email et mot de passe requis")

    # Vérifie l'utilisateur
    query = PREFIX + f'''
    SELECT ?iri ?motdepasse
    WHERE {{
      ?iri :Email "{user.email}" ;
           :motdepasse ?motdepasse .
    }}
    '''
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        if not bindings:
            return {"success": False, "message": "Email ou mot de passe incorrect"}

        hashed = bindings[0]["motdepasse"]["value"]
        iri = bindings[0]["iri"]["value"]

        if verify_password(user.motdepasse, hashed):
            # Extraire le fragment local après #
            local_name = iri.split("#")[-1]

            # Récupérer le rôle de l'utilisateur
            role_query = PREFIX + f'SELECT ?role WHERE {{ :{local_name} a ?role }}'
            role_result = run_select(role_query)
            role_bindings = role_result.get("results", {}).get("bindings", [])
            role = role_bindings[0]["role"]["value"].split("#")[-1] if role_bindings else "Utilisateur"

            # Récupérer toutes les infos de l'utilisateur selon son rôle
            if role == "Etudiant":
                user_query = PREFIX + f'''
                SELECT ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?telephone ?matricule ?niveau ?salaire
                WHERE {{
                  :{local_name} a :Etudiant ;
                               :Nom ?Nom ;
                               :Prénom ?Prénom ;
                               :Email ?Email ;
                               :adresse ?adresse ;
                               :dateNaissance ?dateNaissance ;
                               :telephone ?telephone ;
                               :matricule ?matricule ;
                               :niveau ?niveau ;
                               :salaire ?salaire .
                }}
                '''
            elif role == "Enseignant":
                user_query = PREFIX + f'''
                SELECT ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?telephone ?matricule ?niveau ?salaire
                WHERE {{
                  :{local_name} a :Enseignant ;
                               :Nom ?Nom ;
                               :Prénom ?Prénom ;
                               :Email ?Email ;
                               :adresse ?adresse ;
                               :dateNaissance ?dateNaissance ;
                               :telephone ?telephone ;
                               :matricule ?matricule ;
                               :niveau ?niveau ;
                               :salaire ?salaire .
                }}
                '''
            else:
                # Cas par défaut si d'autres rôles
                user_query = PREFIX + f'''
                SELECT ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?telephone ?matricule ?niveau ?salaire
                WHERE {{
                  :{local_name} a ?role ;
                               :Nom ?Nom ;
                               :Prénom ?Prénom ;
                               :Email ?Email ;
                               :adresse ?adresse ;
                               :dateNaissance ?dateNaissance ;
                               :telephone ?telephone ;
                               :matricule ?matricule ;
                               :niveau ?niveau ;
                               :salaire ?salaire .
                }}
                '''

            result_user = run_select(user_query)
            user_bindings = result_user.get("results", {}).get("bindings", [])
            if user_bindings:
                b = user_bindings[0]
                user_info = {
                    "iri": local_name,
                    "role": role,
                    "nom": b.get("Nom", {}).get("value", ""),
                    "prenom": b.get("Prénom", {}).get("value", ""),
                    "email": b.get("Email", {}).get("value", ""),
                    "adresse": b.get("adresse", {}).get("value", ""),
                    "dateNaissance": b.get("dateNaissance", {}).get("value", ""),
                    "telephone": b.get("telephone", {}).get("value", ""),
                    "matricule": b.get("matricule", {}).get("value", ""),
                    "niveau": b.get("niveau", {}).get("value", ""),
                    "salaire": b.get("salaire", {}).get("value", "0")
                }
            else:
                user_info = {
                    "iri": local_name,
                    "role": role
                }

            return {
                "success": True,
                "message": "Connexion réussie",
                "user": user_info
            }
        else:
            return {"success": False, "message": "Mot de passe incorrect"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (signin): {str(e)}")





reset_codes = {}  # {email: {"code": "123456", "timestamp": 1234567890}}

# ---------------- MODELS ----------------
class EmailRequest(BaseModel):
    email: EmailStr

class VerifyRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str


# ---------------- HELPERS ----------------
def send_email_code(email: str, code: str):
    msg = EmailMessage()
    msg["Subject"] = "🔐 Code de réinitialisation StudyLab"
    msg["From"] = SMTP_USER
    msg["To"] = email
    msg.set_content(f"""
Bonjour,
Voici votre code de réinitialisation de mot de passe : {code}

Ce code expire dans 10 minutes.

Si vous n'avez pas demandé ce changement, ignorez ce message.
    """)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


# ---------------- HACHAGE SIMPLE (SHA-256) ----------------
def hash_password(password: str) -> str:
    """Hachage simple SHA-256"""
    if password is None:
        password = ""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie si le mot de passe correspond"""
    if plain_password is None:
        plain_password = ""
    return hash_password(plain_password) == (hashed_password or "")


# ---------------- MOCK SPARQL ----------------
def find_user_by_email(email: str):
    """Simule une recherche d'utilisateur par email"""
    if email.endswith("@gmail.com"):
        return ":User_" + email.split("@")[0]
    return None


def update_user_password(iri, hashed):
    """Simule une mise à jour du mot de passe"""
    print(f"SPARQL UPDATE: {iri} -> nouveau mot de passe {hashed}")
    return True


# ---------------- ROUTES ----------------
@app.post("/auth/forgot")
def forgot_password(req: EmailRequest):
    user = find_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    code = "".join(random.choices(string.digits, k=6))
    reset_codes[req.email] = {"code": code, "timestamp": time.time()}

    try:
        send_email_code(req.email, code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'envoi d'email : {str(e)}")

    return {"message": "Code envoyé à votre adresse e-mail"}


@app.post("/auth/verify")
def verify_code(req: VerifyRequest):
    entry = reset_codes.get(req.email)
    if not entry:
        raise HTTPException(status_code=400, detail="Aucun code généré pour cet email")

    if time.time() - entry["timestamp"] > 600:  # 10 min
        del reset_codes[req.email]
        raise HTTPException(status_code=400, detail="Code expiré")

    if entry["code"] != req.code:
        raise HTTPException(status_code=400, detail="Code invalide")

    user = find_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    hashed = hash_password(req.new_password)
    update_user_password(user, hashed)

    del reset_codes[req.email]
    return {"message": "Mot de passe mis à jour avec succès"}






# ---------------- GET ETUDIANTS ----------------
@app.get("/etudiants")
def get_etudiants():
    query = PREFIX + """
    SELECT ?iri ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?motdepasse ?telephone ?matricule ?niveau ?salaire
    WHERE {
      ?iri a :Etudiant .
      OPTIONAL { ?iri :Nom ?Nom }
      OPTIONAL { ?iri :Prénom ?Prénom }
      OPTIONAL { ?iri :Email ?Email }
      OPTIONAL { ?iri :adresse ?adresse }
      OPTIONAL { ?iri :dateNaissance ?dateNaissance }
      OPTIONAL { ?iri :motdepasse ?motdepasse }
      OPTIONAL { ?iri :telephone ?telephone }
      OPTIONAL { ?iri :matricule ?matricule }
      OPTIONAL { ?iri :niveau ?niveau }
      OPTIONAL { ?iri :salaire ?salaire }
    } ORDER BY ?Nom
    """
    try:
        data = run_select(query)
        students = []
        for b in data.get("results", {}).get("bindings", []):
            students.append({
                "iri": b.get("iri", {}).get("value", ""),
                "Nom": b.get("Nom", {}).get("value", ""),
                "Prénom": b.get("Prénom", {}).get("value", ""),
                "Email": b.get("Email", {}).get("value", ""),
                "adresse": b.get("adresse", {}).get("value", ""),
                "dateNaissance": b.get("dateNaissance", {}).get("value", ""),
                "motdepasse": b.get("motdepasse", {}).get("value", ""),
                "telephone": b.get("telephone", {}).get("value", ""),
                "matricule": b.get("matricule", {}).get("value", ""),
                "niveau": b.get("niveau", {}).get("value", ""),
                "salaire": b.get("salaire", {}).get("value", "0")
            })
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (etudiants): {str(e)}")

# ---------------- GET ENSEIGNANTS ----------------
@app.get("/enseignants")
def get_enseignants():
    query = PREFIX + """
    SELECT ?iri ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?motdepasse ?telephone ?matricule ?niveau ?salaire
    WHERE {
      ?iri a :Enseignant .
      OPTIONAL { ?iri :Nom ?Nom }
      OPTIONAL { ?iri :Prénom ?Prénom }
      OPTIONAL { ?iri :Email ?Email }
      OPTIONAL { ?iri :adresse ?adresse }
      OPTIONAL { ?iri :dateNaissance ?dateNaissance }
      OPTIONAL { ?iri :motdepasse ?motdepasse }
      OPTIONAL { ?iri :telephone ?telephone }
      OPTIONAL { ?iri :matricule ?matricule }
      OPTIONAL { ?iri :niveau ?niveau }
      OPTIONAL { ?iri :salaire ?salaire }
    } ORDER BY ?Nom
    """
    try:
        data = run_select(query)
        teachers = []
        for b in data.get("results", {}).get("bindings", []):
            teachers.append({
                "iri": b.get("iri", {}).get("value", ""),
                "Nom": b.get("Nom", {}).get("value", ""),
                "Prénom": b.get("Prénom", {}).get("value", ""),
                "Email": b.get("Email", {}).get("value", ""),
                "adresse": b.get("adresse", {}).get("value", ""),
                "dateNaissance": b.get("dateNaissance", {}).get("value", ""),
                "motdepasse": b.get("motdepasse", {}).get("value", ""),
                "telephone": b.get("telephone", {}).get("value", ""),
                "matricule": b.get("matricule", {}).get("value", ""),
                "niveau": b.get("niveau", {}).get("value", ""),
                "salaire": b.get("salaire", {}).get("value", "0")
            })
        return teachers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (enseignants): {str(e)}")
    


    
# ---------------- GET USER PROFILE PAR ROLE ----------------
@app.get("/userprofile/{role}/{user_iri}")
def get_user_profile(role: str, user_iri: str):
    """
    Récupère les infos d'un utilisateur selon son rôle : Etudiant ou Enseignant
    """
    if role.lower() == "etudiant":
        query = PREFIX + f"""
        SELECT ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?telephone ?matricule ?niveau ?salaire
        WHERE {{
            ?iri a :Etudiant ;
                 :Nom ?Nom ;
                 :Prénom ?Prénom ;
                 :Email ?Email ;
                 :adresse ?adresse ;
                 :dateNaissance ?dateNaissance ;
                 :telephone ?telephone .
            FILTER(strends(str(?iri), "{user_iri}"))
            OPTIONAL {{ ?iri :matricule ?matricule }}
            OPTIONAL {{ ?iri :niveau ?niveau }}
            OPTIONAL {{ ?iri :salaire ?salaire }}
        }}
        """
    elif role.lower() == "enseignant":
        query = PREFIX + f"""
        SELECT ?Nom ?Prénom ?Email ?adresse ?dateNaissance ?telephone ?matricule ?niveau ?salaire
        WHERE {{
            ?iri a :Enseignant ;
                 :Nom ?Nom ;
                 :Prénom ?Prénom ;
                 :Email ?Email ;
                 :adresse ?adresse ;
                 :dateNaissance ?dateNaissance ;
                 :telephone ?telephone .
            FILTER(strends(str(?iri), "{user_iri}"))
            OPTIONAL {{ ?iri :matricule ?matricule }}
            OPTIONAL {{ ?iri :niveau ?niveau }}
            OPTIONAL {{ ?iri :salaire ?salaire }}
        }}
        """
    else:
        raise HTTPException(status_code=400, detail="Rôle inconnu")

    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        if not bindings:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        b = bindings[0]
        return {
            "nom": b.get("Nom", {}).get("value", ""),
            "prenom": b.get("Prénom", {}).get("value", ""),
            "email": b.get("Email", {}).get("value", ""),
            "adresse": b.get("adresse", {}).get("value", ""),
            "dateNaissance": b.get("dateNaissance", {}).get("value", ""),
            "telephone": b.get("telephone", {}).get("value", ""),
            "matricule": b.get("matricule", {}).get("value", ""),
            "niveau": b.get("niveau", {}).get("value", ""),
            "salaire": b.get("salaire", {}).get("value", "0"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL: {str(e)}")



# 🟦 PUT — Modifier un profil utilisateur
# 🟦 PUT — Modifier un profil utilisateur
@app.put("/userprofile/{role}/{user_iri}")
def update_user_profile(role: str, user_iri: str, user: dict):
    """
    Met à jour uniquement les champs fournis pour un utilisateur (étudiant ou enseignant)
    """
    iri = f":{user_iri}"

    # On définit les propriétés à modifier selon le rôle
    common_fields = ["Nom", "Prénom", "Email", "adresse", "dateNaissance", "telephone"]
    etudiant_fields = ["matricule", "niveau"]
    enseignant_fields = ["salaire"]

    update_fields = []
    for key, value in user.items():
        if value and key in common_fields + etudiant_fields + enseignant_fields:
            update_fields.append(f'{iri} :{key} "{value}" .')

    if not update_fields:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    query = PREFIX + f"""
    DELETE {{
        {iri} ?p ?o .
    }}
    INSERT {{
        {iri} a :{role.capitalize()} .
        {' '.join(update_fields)}
    }}
    WHERE {{
        {iri} ?p ?o .
    }}
    """
    try:
        run_update(query)
        return {"message": "Profil mis à jour avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_user_profile): {str(e)}")



# 🟥 DELETE — Supprimer un profil utilisateur
@app.delete("/userprofile/{role}/{user_iri}")
def delete_user_profile(role: str, user_iri: str):
    """
    Supprime complètement un utilisateur (étudiant ou enseignant) et toutes ses relations
    """
    iri = f":{user_iri}"

    query = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }};
    DELETE WHERE {{
        ?s ?p {iri} .
    }}
    """
    try:
        run_update(query)
        return {"message": f"{role.capitalize()} supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_user_profile): {str(e)}")









# -----------------------------
# CRUD COURS
# -----------------------------


class Course(BaseModel):
    codeCours: str
    nomCours: str
    volumeHoraire: int

class Chapitre(BaseModel):
    numeroChapitre: str
    titreChapitre: str

# ---------------- Exercice ----------------
class Exercice(BaseModel):
    titreExercice: str
    difficulte: str
    score: int

# ---------------- Support ----------------
class Support(BaseModel):
    titreSupport: str
    formatSupport: str
    tailleSupport: str

# ---------------- Examen ----------------
class Examen(BaseModel):
    titreExamen: str
    dateExamen: str   # ou datetime si tu veux gérer la date correctement
    duree: int        # durée en minutes, par exemple


class CoursEnLigne(BaseModel):
    plateforme: str
    url: str

class Devoir(BaseModel):
    titreDevoir: str
    consigne: str
    dateSoumission: str

class Soutenance(BaseModel):
    dateSoutenance: str
    noteSoutenance: float



class Institution(BaseModel):
    nom: str
    nomInstitution: str
    Ville: str
    adresseInstitution: str
    adressemail: str
    telephoneInstitution: str
    anneeCreation: str
    description: str

class Classe(BaseModel):
    nomClasse: str

class Departement(BaseModel):
    nomDepartement: str


# Diplome
class Diplome(BaseModel):
    typeDiplome: str
    anneObtention: int
    mention: str
    

class Note(BaseModel):
    dateEvaluation: str
    noteMax: float
    typeEvaluation: str

# Attestation
class Attestation(BaseModel):
    titreAttestation: str
    dateObtention: str
    organisme: str


class Matiere(BaseModel):
    codeMatiere: str
    nomMatiere: str
    domaine: str


class Projet(BaseModel):
    titreProjet: str
    dateDebut: str
    dateFin: str
    descriptionProjet: str
    typeProjet: str

class Competence(BaseModel):
    nomCompetence: str
    niveauCompetence: str
    typeCompetence: str

class Notification(BaseModel):
    contenuNotification: str
    dateEnvoi: str
    typeNotification: str




@app.get("/courses", response_model=List[Course])
def get_courses():
    query = PREFIX + """
    SELECT ?codeCours ?nomCours ?volumeHoraire
    WHERE {
        ?c a :Cours ;
           :codeCours ?codeCours ;
           :nomCours ?nomCours ;
           :volumeHoraire ?volumeHoraire .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "codeCours": b.get("codeCours", {}).get("value", ""),
                "nomCours": b.get("nomCours", {}).get("value", ""),
                "volumeHoraire": int(b.get("volumeHoraire", {}).get("value", 0))
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_courses): {str(e)}")


@app.post("/courses")
def add_course(course: Course):
    iri = f":Cours_{course.codeCours.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Cours ;
              :codeCours "{course.codeCours}" ;
              :nomCours "{course.nomCours}" ;
              :volumeHoraire "{course.volumeHoraire}"^^xsd:int .
    }}
    """
    try:
        run_update(query)
        return {"message": "Cours ajouté avec succès", "codeCours": course.codeCours}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_course): {str(e)}")


@app.put("/courses/{codeCours}")
def update_course(codeCours: str, course: Course):
    iri = f":Cours_{codeCours.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :nomCours ?n ;
              :volumeHoraire ?v .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :nomCours "{course.nomCours}" ;
              :volumeHoraire "{course.volumeHoraire}"^^xsd:int .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Cours {codeCours} mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_course): {str(e)}")


@app.delete("/courses/{codeCours}")
def delete_course(codeCours: str):
    iri = f":Cours_{codeCours.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Cours {codeCours} supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_course): {str(e)}")
    






# ---------------- Chapitre ----------------
@app.get("/chapitres", response_model=List[Chapitre])
def get_chapitres():
    query = PREFIX + """
    SELECT ?numeroChapitre ?titreChapitre
    WHERE {
        ?c a :Chapitre ;
           :numeroChapitre ?numeroChapitre ;
           :titreChapitre ?titreChapitre .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "numeroChapitre": b.get("numeroChapitre", {}).get("value", ""),
                "titreChapitre": b.get("titreChapitre", {}).get("value", "")
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_chapitres): {str(e)}")

@app.post("/chapitres")
def add_chapitre(chapitre: Chapitre):
    iri = f":Chapitre_{chapitre.numeroChapitre.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Chapitre ;
              :numeroChapitre "{chapitre.numeroChapitre}" ;
              :titreChapitre "{chapitre.titreChapitre}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Chapitre ajouté avec succès", "numeroChapitre": chapitre.numeroChapitre}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_chapitre): {str(e)}")

@app.put("/chapitres/{numeroChapitre}")
def update_chapitre(numeroChapitre: str, chapitre: Chapitre):
    iri = f":Chapitre_{numeroChapitre.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :titreChapitre ?t .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :titreChapitre "{chapitre.titreChapitre}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Chapitre {numeroChapitre} mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_chapitre): {str(e)}")

@app.delete("/chapitres/{numeroChapitre}")
def delete_chapitre(numeroChapitre: str):
    iri = f":Chapitre_{numeroChapitre.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Chapitre {numeroChapitre} supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_chapitre): {str(e)}")

# ---------------- Exercice ----------------
@app.get("/exercices", response_model=List[Exercice])
def get_exercices():
    query = PREFIX + """
    SELECT ?titreExercice ?difficulte ?score
    WHERE {
        ?e a :Exercice ;
           :titreExercice ?titreExercice ;
           :difficulte ?difficulte ;
           :score ?score .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreExercice": b.get("titreExercice", {}).get("value", ""),
                "difficulte": b.get("difficulte", {}).get("value", ""),
                "score": int(b.get("score", {}).get("value", 0))
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_exercices): {str(e)}")

@app.post("/exercices")
def add_exercice(exercice: Exercice):
    iri = f":Exercice_{exercice.titreExercice.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Exercice ;
              :titreExercice "{exercice.titreExercice}" ;
              :difficulte "{exercice.difficulte}" ;
              :score "{exercice.score}"^^xsd:int .
    }}
    """
    try:
        run_update(query)
        return {"message": "Exercice ajouté", "titreExercice": exercice.titreExercice}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_exercice): {str(e)}")

@app.put("/exercices/{titreExercice}")
def update_exercice(titreExercice: str, exercice: Exercice):
    iri = f":Exercice_{titreExercice.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :difficulte ?d ;
              :score ?s .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :difficulte "{exercice.difficulte}" ;
              :score "{exercice.score}"^^xsd:int .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Exercice {titreExercice} mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_exercice): {str(e)}")

@app.delete("/exercices/{titreExercice}")
def delete_exercice(titreExercice: str):
    iri = f":Exercice_{titreExercice.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Exercice {titreExercice} supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_exercice): {str(e)}")

# ---------------- Support ----------------
@app.get("/supports", response_model=List[Support])
def get_supports():
    query = PREFIX + """
    SELECT ?titreSupport ?formatSupport ?tailleSupport
    WHERE {
        ?s a :Support ;
           :titreSupport ?titreSupport ;
           :formatSupport ?formatSupport ;
           :tailleSupport ?tailleSupport .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreSupport": b.get("titreSupport", {}).get("value", ""),
                "formatSupport": b.get("formatSupport", {}).get("value", ""),
                "tailleSupport": b.get("tailleSupport", {}).get("value", "")
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_supports): {str(e)}")

@app.post("/supports")
def add_support(support: Support):
    iri = f":Support_{support.titreSupport.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Support ;
              :titreSupport "{support.titreSupport}" ;
              :formatSupport "{support.formatSupport}" ;
              :tailleSupport "{support.tailleSupport}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Support ajouté", "titreSupport": support.titreSupport}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_support): {str(e)}")

@app.put("/supports/{titreSupport}")
def update_support(titreSupport: str, support: Support):
    iri = f":Support_{titreSupport.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :formatSupport ?f ;
              :tailleSupport ?t .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :formatSupport "{support.formatSupport}" ;
              :tailleSupport "{support.tailleSupport}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Support {titreSupport} mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_support): {str(e)}")

@app.delete("/supports/{titreSupport}")
def delete_support(titreSupport: str):
    iri = f":Support_{titreSupport.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Support {titreSupport} supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_support): {str(e)}")

# ---------------- Examen ----------------
@app.get("/examens", response_model=List[Examen])
def get_examens():
    query = PREFIX + """
    SELECT ?titreExamen ?dateExamen ?duree
    WHERE {
        ?e a :Examen ;
           :titreExamen ?titreExamen ;
           :dateExamen ?dateExamen ;
           :duree ?duree .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreExamen": b.get("titreExamen", {}).get("value", ""),
                "dateExamen": b.get("dateExamen", {}).get("value", ""),
                "duree": int(b.get("duree", {}).get("value", 0))
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_examens): {str(e)}")

@app.post("/examens")
def add_examen(examen: Examen):
    iri = f":Examen_{examen.titreExamen.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Examen ;
              :titreExamen "{examen.titreExamen}" ;
              :dateExamen "{examen.dateExamen}" ;
              :duree "{examen.duree}"^^xsd:int .
    }}
    """
    try:
        run_update(query)
        return {"message": "Examen ajouté", "titreExamen": examen.titreExamen}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_examen): {str(e)}")

@app.put("/examens/{titreExamen}")
def update_examen(titreExamen: str, examen: Examen):
    iri = f":Examen_{titreExamen.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :dateExamen ?d ;
              :duree ?du .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :dateExamen "{examen.dateExamen}" ;
              :duree "{examen.duree}"^^xsd:int .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Examen {titreExamen} mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_examen): {str(e)}")

@app.delete("/examens/{titreExamen}")
def delete_examen(titreExamen: str):
    iri = f":Examen_{titreExamen.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Examen {titreExamen} supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_examen): {str(e)}")


# ------------------- Cours en Ligne -------------------
@app.get("/coursenligne", response_model=List[CoursEnLigne])
def get_coursenligne():
    query = PREFIX + """
    SELECT ?plateforme ?url
    WHERE {
        ?c a :CoursEnLigne ;
           :plateforme ?plateforme ;
           :url ?url .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "plateforme": b.get("plateforme", {}).get("value", ""),
                "url": b.get("url", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_coursenligne): {str(e)}")

@app.post("/coursenligne")
def add_coursenligne(c: CoursEnLigne):
    iri = f":CoursEnLigne_{c.plateforme.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :CoursEnLigne ;
              :plateforme "{c.plateforme}" ;
              :url "{c.url}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Cours en ligne ajouté"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_coursenligne): {str(e)}")

# Les PUT et DELETE suivent exactement le même pattern que Cours et Chapitre


@app.put("/coursenligne/{plateforme}")
def update_coursenligne(plateforme: str, cours: CoursEnLigne):
    iri = f":CoursEnLigne_{plateforme.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :url ?u .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :plateforme "{cours.plateforme}" ;
              :url "{cours.url}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Cours en ligne '{plateforme}' mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_coursenligne): {str(e)}")


@app.delete("/coursenligne/{plateforme}")
def delete_coursenligne(plateforme: str):
    iri = f":CoursEnLigne_{plateforme.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Cours en ligne '{plateforme}' supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_coursenligne): {str(e)}")



# ======================
# 🔹 Ajouter un devoir
# ======================
@app.post("/devoirs")
def add_devoir(d: Devoir):
    iri = f":Devoir_{d.titreDevoir.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Devoir ;
              :titreDevoir "{d.titreDevoir}" ;
              :consigne "{d.consigne}" ;
              :dateSoumission "{d.dateSoumission}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Devoir ajouté"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_devoir): {str(e)}")
# ======================
# 🔹 Récupérer tous les devoirs
# ======================
# ------------------- Devoir -------------------
@app.get("/devoirs", response_model=List[Devoir])
def get_devoirs():
    query = PREFIX + """
    SELECT ?titreDevoir ?consigne ?dateSoumission
    WHERE {
        ?d a :Devoir ;
           :titreDevoir ?titreDevoir ;
           :consigne ?consigne ;
           :dateSoumission ?dateSoumission .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreDevoir": b.get("titreDevoir", {}).get("value", ""),
                "consigne": b.get("consigne", {}).get("value", ""),
                "dateSoumission": b.get("dateSoumission", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_devoirs): {str(e)}")
# ======================
# 🔹 Mettre à jour un devoir
# ======================
# ------------------- Modifier un devoir -------------------
@app.put("/devoirs/{titreDevoir}")
def update_devoir(titreDevoir: str, devoir: Devoir):
    iri = f":Devoir_{titreDevoir.replace(' ', '_')}"
    # Supprimer les anciennes valeurs
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :consigne ?c ;
              :dateSoumission ?d .
    }};
    """
    # Insérer les nouvelles valeurs
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :titreDevoir "{devoir.titreDevoir}" ;
              :consigne "{devoir.consigne}" ;
              :dateSoumission "{devoir.dateSoumission}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Devoir '{titreDevoir}' mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_devoir): {str(e)}")


# ------------------- Supprimer un devoir -------------------
@app.delete("/devoirs/{titreDevoir}")
def delete_devoir(titreDevoir: str):
    iri = f":Devoir_{titreDevoir.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Devoir '{titreDevoir}' supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_devoir): {str(e)}")


# ------------------- POST -------------------
# ------------------- POST -------------------
# ------------------- GET Soutenances -------------------
@app.get("/soutenances", response_model=List[Soutenance])
def get_soutenances():
    query = PREFIX + """
    SELECT ?dateSoutenance ?noteSoutenance
    WHERE {
        ?s a :Soutenance ;
           :dateSoutenance ?dateSoutenance ;
           :noteSoutenance ?noteSoutenance .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "dateSoutenance": b.get("dateSoutenance", {}).get("value", ""),
                "noteSoutenance": float(b.get("noteSoutenance", {}).get("value", 0))
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_soutenances): {str(e)}")

@app.post("/soutenances")
def add_soutenance(s: Soutenance):
    iri = f":Soutenance_{s.dateSoutenance.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Soutenance ;
              :dateSoutenance "{s.dateSoutenance}" ;
              :noteSoutenance "{s.noteSoutenance}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Soutenance ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_soutenance): {str(e)}")


# ------------------- PUT -------------------
@app.put("/soutenances/{dateSoutenance}")
def update_soutenance(dateSoutenance: str, s: Soutenance):
    iri = f":Soutenance_{dateSoutenance.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} :noteSoutenance ?n .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} :dateSoutenance "{s.dateSoutenance}" ;
              :noteSoutenance "{s.noteSoutenance}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Soutenance '{dateSoutenance}' mise à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_soutenance): {str(e)}")


# ------------------- DELETE -------------------
@app.delete("/soutenances/{dateSoutenance}")
def delete_soutenance(dateSoutenance: str):
    iri = f":Soutenance_{dateSoutenance.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Soutenance '{dateSoutenance}' supprimée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_soutenance): {str(e)}")



# ------------------- GET -------------------
@app.get("/institutions", response_model=List[Institution])
def get_institutions():
    query = PREFIX + """
    SELECT ?nom ?nomInstitution ?Ville ?adresseInstitution ?adressemail ?telephoneInstitution ?anneeCreation ?description
    WHERE {
        ?i a :Institutions ;
           :nom ?nom ;
           :nomInstitution ?nomInstitution ;
           :Ville ?Ville ;
           :adresseInstitution ?adresseInstitution ;
           :adressemail ?adressemail ;
           :telephoneInstitution ?telephoneInstitution ;
           :anneeCreation ?anneeCreation ;
           :description ?description .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "nom": b.get("nom", {}).get("value", ""),
                "nomInstitution": b.get("nomInstitution", {}).get("value", ""),
                "Ville": b.get("Ville", {}).get("value", ""),
                "adresseInstitution": b.get("adresseInstitution", {}).get("value", ""),
                "adressemail": b.get("adressemail", {}).get("value", ""),
                "telephoneInstitution": b.get("telephoneInstitution", {}).get("value", ""),
                "anneeCreation": b.get("anneeCreation", {}).get("value", ""),
                "description": b.get("description", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_institutions): {str(e)}")

# ------------------- POST -------------------
@app.post("/institutions")
def add_institution(i: Institution):
    iri = f":Institution_{i.nomInstitution.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Institutions ;
              :nom "{i.nom}" ;
              :nomInstitution "{i.nomInstitution}" ;
              :Ville "{i.Ville}" ;
              :adresseInstitution "{i.adresseInstitution}" ;
              :adressemail "{i.adressemail}" ;
              :telephoneInstitution "{i.telephoneInstitution}" ;
              :anneeCreation "{i.anneeCreation}" ;
              :description "{i.description}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Institution ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_institution): {str(e)}")

# ------------------- PUT -------------------
@app.put("/institutions/{nomInstitution}")
def update_institution(nomInstitution: str, i: Institution):
    iri = f":Institution_{nomInstitution.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Institutions ;
              :nom "{i.nom}" ;
              :nomInstitution "{i.nomInstitution}" ;
              :Ville "{i.Ville}" ;
              :adresseInstitution "{i.adresseInstitution}" ;
              :adressemail "{i.adressemail}" ;
              :telephoneInstitution "{i.telephoneInstitution}" ;
              :anneeCreation "{i.anneeCreation}" ;
              :description "{i.description}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Institution '{nomInstitution}' mise à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_institution): {str(e)}")

# ------------------- DELETE -------------------
@app.delete("/institutions/{nomInstitution}")
def delete_institution(nomInstitution: str):
    iri = f":Institution_{nomInstitution.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Institution '{nomInstitution}' supprimée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_institution): {str(e)}")
    




# ------------------- GET -------------------
@app.get("/classes", response_model=List[Classe])
def get_classes():
    query = PREFIX + """
    SELECT ?nomClasse
    WHERE {
        ?c a :Classe ;
           :nomClasse ?nomClasse .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {"nomClasse": b.get("nomClasse", {}).get("value", "")}
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_classes): {str(e)}")

# ------------------- POST -------------------
@app.post("/classes")
def add_classe(c: Classe):
    iri = f":Classe_{c.nomClasse.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Classe ;
              :nomClasse "{c.nomClasse}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Classe ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_classe): {str(e)}")

# ------------------- PUT -------------------
@app.put("/classes/{nomClasse}")
def update_classe(nomClasse: str, c: Classe):
    iri = f":Classe_{nomClasse.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Classe ;
              :nomClasse "{c.nomClasse}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Classe '{nomClasse}' mise à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_classe): {str(e)}")

# ------------------- DELETE -------------------
@app.delete("/classes/{nomClasse}")
def delete_classe(nomClasse: str):
    iri = f":Classe_{nomClasse.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Classe '{nomClasse}' supprimée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_classe): {str(e)}")



# 🔹 GET all départements
@app.get("/departements", response_model=List[Departement])
def get_departements():
    query = PREFIX + """
    SELECT ?nomDepartement
    WHERE {
        ?d a :Departement ;
           :nomDepartement ?nomDepartement .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {"nomDepartement": b.get("nomDepartement", {}).get("value", "")}
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_departements): {str(e)}")

# 🔹 POST add département
@app.post("/departements")
def add_departement(d: Departement):
    iri = f":Departement_{d.nomDepartement.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Departement ;
              :nomDepartement "{d.nomDepartement}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Département ajouté"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_departement): {str(e)}")

# 🔹 PUT update département
@app.put("/departements/{nomDepartement}")
def update_departement(nomDepartement: str, d: Departement):
    iri = f":Departement_{nomDepartement.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Departement ;
              :nomDepartement "{d.nomDepartement}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Département '{nomDepartement}' mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_departement): {str(e)}")

# 🔹 DELETE département
@app.delete("/departements/{nomDepartement}")
def delete_departement(nomDepartement: str):
    iri = f":Departement_{nomDepartement.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Département '{nomDepartement}' supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_departement): {str(e)}")
    


@app.get("/diplomes", response_model=List[Diplome])
def get_diplomes():
    query = PREFIX + """
    SELECT ?typeDiplome ?anneObtention ?mention
    WHERE {
        ?d a :Diplome ;
           :typeDiplome ?typeDiplome ;
           :anneObtention ?anneObtention ;
           :mention ?mention .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "typeDiplome": b.get("typeDiplome", {}).get("value", ""),
                "anneObtention": int(b.get("anneObtention", {}).get("value", 0)),
                "mention": b.get("mention", {}).get("value", "")
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_diplomes): {str(e)}")

@app.post("/diplomes")
def add_diplome(d: Diplome):
    iri = f":Diplome_{d.typeDiplome.replace(' ', '_')}_{d.anneObtention}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Diplome ;
              :typeDiplome "{d.typeDiplome}" ;
              :anneObtention {d.anneObtention} ;
              :mention "{d.mention}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Diplome ajouté"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_diplome): {str(e)}")

@app.put("/diplomes/{typeDiplome}/{anneObtention}")
def update_diplome(typeDiplome: str, anneObtention: int, d: Diplome):
    iri = f":Diplome_{typeDiplome.replace(' ', '_')}_{anneObtention}"
    delete_old = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }};"
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Diplome ;
              :typeDiplome "{d.typeDiplome}" ;
              :anneObtention {d.anneObtention} ;
              :mention "{d.mention}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Diplome '{typeDiplome}' mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_diplome): {str(e)}")

@app.delete("/diplomes/{typeDiplome}/{anneObtention}")
def delete_diplome(typeDiplome: str, anneObtention: int):
    iri = f":Diplome_{typeDiplome.replace(' ', '_')}_{anneObtention}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Diplome '{typeDiplome}' supprimé"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_diplome): {str(e)}")

# ------------------- GET -------------------
@app.get("/notes", response_model=List[Note])
def get_notes():
    query = PREFIX + """
    SELECT ?dateEvaluation ?noteMax ?typeEvaluation
    WHERE {
        ?n a :Note ;
           :dateEvaluation ?dateEvaluation ;
           :noteMax ?noteMax ;
           :typeEvaluation ?typeEvaluation .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "dateEvaluation": b.get("dateEvaluation", {}).get("value", ""),
                "noteMax": float(b.get("noteMax", {}).get("value", 0)),
                "typeEvaluation": b.get("typeEvaluation", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_notes): {str(e)}")

# ------------------- POST -------------------
@app.post("/notes")
def add_note(n: Note):
    iri = f":Note_{n.dateEvaluation.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Note ;
               :dateEvaluation "{n.dateEvaluation}" ;
               :noteMax "{n.noteMax}" ;
               :typeEvaluation "{n.typeEvaluation}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Note ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_note): {str(e)}")

# ------------------- PUT -------------------
@app.put("/notes/{dateEvaluation}")
def update_note(dateEvaluation: str, n: Note):
    iri = f":Note_{dateEvaluation.replace(' ', '_')}"
    delete_old = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }};
    """
    insert_new = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Note ;
               :dateEvaluation "{n.dateEvaluation}" ;
               :noteMax "{n.noteMax}" ;
               :typeEvaluation "{n.typeEvaluation}" .
    }}
    """
    try:
        run_update(delete_old)
        run_update(insert_new)
        return {"message": f"Note '{dateEvaluation}' mise à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_note): {str(e)}")

# ------------------- DELETE -------------------
@app.delete("/notes/{dateEvaluation}")
def delete_note(dateEvaluation: str):
    iri = f":Note_{dateEvaluation.replace(' ', '_')}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o }}"
    try:
        run_update(query)
        return {"message": f"Note '{dateEvaluation}' supprimée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_note): {str(e)}")

@app.get("/attestations", response_model=List[Attestation])
def get_attestations():
    query = PREFIX + """
    SELECT ?titreAttestation ?dateObtention ?organisme
    WHERE {
        ?a a :Attestation ;
           :titreAttestation ?titreAttestation ;
           :dateObtention ?dateObtention ;
           :organisme ?organisme .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreAttestation": b.get("titreAttestation", {}).get("value", ""),
                "dateObtention": b.get("dateObtention", {}).get("value", ""),
                "organisme": b.get("organisme", {}).get("value", "")
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_attestations): {str(e)}")

@app.post("/attestations")
def add_attestation(a: Attestation):
    iri = f":Attestation_{a.titreAttestation.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Attestation ;
              :titreAttestation "{a.titreAttestation}" ;
              :dateObtention "{a.dateObtention}" ;
              :organisme "{a.organisme}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Attestation ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_attestation): {str(e)}")



# 🔹 GET : liste des matières
@app.get("/matieres", response_model=List[Matiere])
def get_matieres():
    query = PREFIX + """
    SELECT ?codeMatiere ?nomMatiere ?domaine
    WHERE {
        ?m a :Matiere ;
           :codeMatiere ?codeMatiere ;
           :nomMatiere ?nomMatiere ;
           :domaine ?domaine .
    }
    """
    try:
        result = run_select(query)
        bindings = result["results"]["bindings"]
        return [
            {
                "codeMatiere": b["codeMatiere"]["value"],
                "nomMatiere": b["nomMatiere"]["value"],
                "domaine": b["domaine"]["value"]
            } for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_matieres): {str(e)}")


# 🔹 POST : ajouter une matière
@app.post("/matieres")
def add_matiere(m: Matiere):
    iri = f":Matiere_{m.codeMatiere}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Matiere ;
              :codeMatiere "{m.codeMatiere}" ;
              :nomMatiere "{m.nomMatiere}" ;
              :domaine "{m.domaine}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Matière ajoutée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_matiere): {str(e)}")


# 🔹 PUT : modifier une matière
@app.put("/matieres/{codeMatiere}")
def update_matiere(codeMatiere: str, m: Matiere):
    iri = f":Matiere_{codeMatiere}"
    query = PREFIX + f"""
    DELETE {{
        {iri} :nomMatiere ?oldNom ;
              :domaine ?oldDom .
    }}
    INSERT {{
        {iri} a :Matiere ;
              :codeMatiere "{m.codeMatiere}" ;
              :nomMatiere "{m.nomMatiere}" ;
              :domaine "{m.domaine}" .
    }}
    WHERE {{
        OPTIONAL {{ {iri} :nomMatiere ?oldNom . }}
        OPTIONAL {{ {iri} :domaine ?oldDom . }}
    }}
    """
    try:
        run_update(query)
        return {"message": "Matière mise à jour avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_matiere): {str(e)}")


# 🔹 DELETE : supprimer une matière
@app.delete("/matieres/{codeMatiere}")
def delete_matiere(codeMatiere: str):
    iri = f":Matiere_{codeMatiere}"
    query = PREFIX + f"DELETE WHERE {{ {iri} ?p ?o . }}"
    try:
        run_update(query)
        return {"message": "Matière supprimée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_matiere): {str(e)}")
    

# 🟩 GET — Lister tous les projets
@app.get("/projets", response_model=List[Projet])
def get_projets():
    query = PREFIX + """
    SELECT ?titreProjet ?dateDebut ?dateFin ?descriptionProjet ?typeProjet
    WHERE {
        ?p a :Projet ;
           :titreProjet ?titreProjet ;
           :dateDebut ?dateDebut ;
           :dateFin ?dateFin ;
           :descriptionProjet ?descriptionProjet ;
           :typeProjet ?typeProjet .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "titreProjet": b.get("titreProjet", {}).get("value", ""),
                "dateDebut": b.get("dateDebut", {}).get("value", ""),
                "dateFin": b.get("dateFin", {}).get("value", ""),
                "descriptionProjet": b.get("descriptionProjet", {}).get("value", ""),
                "typeProjet": b.get("typeProjet", {}).get("value", ""),
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_projets): {str(e)}")


# 🟦 POST — Ajouter un projet
@app.post("/projets")
def add_projet(p: Projet):
    iri = f":Projet_{p.titreProjet.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Projet ;
              :titreProjet "{p.titreProjet}" ;
              :dateDebut "{p.dateDebut}" ;
              :dateFin "{p.dateFin}" ;
              :descriptionProjet "{p.descriptionProjet}" ;
              :typeProjet "{p.typeProjet}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Projet ajouté avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_projet): {str(e)}")


# 🟨 PUT — Modifier un projet existant
@app.put("/projets/{titreProjet}")
def update_projet(titreProjet: str, p: Projet):
    iri = f":Projet_{titreProjet.replace(' ', '_')}"
    query = PREFIX + f"""
    DELETE {{
        {iri} :titreProjet ?t ;
              :dateDebut ?d1 ;
              :dateFin ?d2 ;
              :descriptionProjet ?desc ;
              :typeProjet ?tp .
    }}
    INSERT {{
        {iri} :titreProjet "{p.titreProjet}" ;
              :dateDebut "{p.dateDebut}" ;
              :dateFin "{p.dateFin}" ;
              :descriptionProjet "{p.descriptionProjet}" ;
              :typeProjet "{p.typeProjet}" .
    }}
    WHERE {{
        {iri} a :Projet ;
              :titreProjet ?t ;
              :dateDebut ?d1 ;
              :dateFin ?d2 ;
              :descriptionProjet ?desc ;
              :typeProjet ?tp .
    }}
    """
    try:
        run_update(query)
        return {"message": "Projet modifié avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_projet): {str(e)}")


# 🟥 DELETE — Supprimer un projet
@app.delete("/projets/{titreProjet}")
def delete_projet(titreProjet: str):
    iri = f":Projet_{titreProjet.replace(' ', '_')}"
    query = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }}
    """
    try:
        run_update(query)
        return {"message": "Projet supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_projet): {str(e)}")


# 🟩 GET — Lister toutes les compétences
@app.get("/competences", response_model=List[Competence])
def get_competences():
    query = PREFIX + """
    SELECT ?nomCompetence ?niveauCompetence ?typeCompetence
    WHERE {
        ?c a :Competence ;
           :nomCompetence ?nomCompetence ;
           :niveauCompetence ?niveauCompetence ;
           :typeCompetence ?typeCompetence .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "nomCompetence": b.get("nomCompetence", {}).get("value", ""),
                "niveauCompetence": b.get("niveauCompetence", {}).get("value", ""),
                "typeCompetence": b.get("typeCompetence", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_competences): {str(e)}")


# 🟦 POST — Ajouter une compétence
@app.post("/competences")
def add_competence(c: Competence):
    iri = f":Competence_{c.nomCompetence.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Competence ;
              :nomCompetence "{c.nomCompetence}" ;
              :niveauCompetence "{c.niveauCompetence}" ;
              :typeCompetence "{c.typeCompetence}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Compétence ajoutée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_competence): {str(e)}")


# 🟨 PUT — Modifier une compétence
@app.put("/competences/{nomCompetence}")
def update_competence(nomCompetence: str, c: Competence):
    iri = f":Competence_{nomCompetence.replace(' ', '_')}"
    query = PREFIX + f"""
    DELETE {{
        {iri} :nomCompetence ?n ;
              :niveauCompetence ?niv ;
              :typeCompetence ?type .
    }}
    INSERT {{
        {iri} :nomCompetence "{c.nomCompetence}" ;
              :niveauCompetence "{c.niveauCompetence}" ;
              :typeCompetence "{c.typeCompetence}" .
    }}
    WHERE {{
        {iri} a :Competence ;
              :nomCompetence ?n ;
              :niveauCompetence ?niv ;
              :typeCompetence ?type .
    }}
    """
    try:
        run_update(query)
        return {"message": "Compétence modifiée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_competence): {str(e)}")


# 🟥 DELETE — Supprimer une compétence
@app.delete("/competences/{nomCompetence}")
def delete_competence(nomCompetence: str):
    iri = f":Competence_{nomCompetence.replace(' ', '_')}"
    query = PREFIX + f"""
    DELETE WHERE {{
        {iri} ?p ?o .
    }}
    """
    try:
        run_update(query)
        return {"message": "Compétence supprimée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_competence): {str(e)}")
    


# ==============================
# 🔔 CRUD NOTIFICATIONS
# ==============================

@app.get("/notifications", response_model=List[Notification])
def get_notifications():
    query = PREFIX + """
    SELECT ?contenuNotification ?dateEnvoi ?typeNotification
    WHERE {
        ?n a :Notification ;
           :contenuNotification ?contenuNotification ;
           :dateEnvoi ?dateEnvoi ;
           :typeNotification ?typeNotification .
    }
    """
    try:
        result = run_select(query)
        bindings = result.get("results", {}).get("bindings", [])
        return [
            {
                "contenuNotification": b.get("contenuNotification", {}).get("value", ""),
                "dateEnvoi": b.get("dateEnvoi", {}).get("value", ""),
                "typeNotification": b.get("typeNotification", {}).get("value", "")
            }
            for b in bindings
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (get_notifications): {str(e)}")


@app.post("/notifications")
def add_notification(n: Notification):
    iri = f":Notification_{n.dateEnvoi.replace(' ', '_')}_{n.typeNotification.replace(' ', '_')}"
    query = PREFIX + f"""
    INSERT DATA {{
        {iri} a :Notification ;
              :contenuNotification "{n.contenuNotification}" ;
              :dateEnvoi "{n.dateEnvoi}" ;
              :typeNotification "{n.typeNotification}" .
    }}
    """
    try:
        run_update(query)
        return {"message": "Notification ajoutée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (add_notification): {str(e)}")


@app.put("/notifications/{dateEnvoi}")
def update_notification(dateEnvoi: str, n: Notification):
    iri = f":Notification_{dateEnvoi.replace(' ', '_')}_{n.typeNotification.replace(' ', '_')}"
    query = PREFIX + f"""
    DELETE {{
        {iri} :contenuNotification ?c ;
              :dateEnvoi ?d ;
              :typeNotification ?t .
    }}
    INSERT {{
        {iri} :contenuNotification "{n.contenuNotification}" ;
              :dateEnvoi "{n.dateEnvoi}" ;
              :typeNotification "{n.typeNotification}" .
    }}
    WHERE {{
        {iri} a :Notification ;
              :contenuNotification ?c ;
              :dateEnvoi ?d ;
              :typeNotification ?t .
    }}
    """
    try:
        run_update(query)
        return {"message": "Notification modifiée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (update_notification): {str(e)}")


@app.delete("/notifications/{dateEnvoi}")
def delete_notification(dateEnvoi: str):
    iri_pattern = f":Notification_{dateEnvoi.replace(' ', '_')}_"
    query = PREFIX + f"""
    DELETE WHERE {{
        ?n ?p ?o .
        FILTER(STRSTARTS(STR(?n), STR({iri_pattern})))
    }}
    """
    try:
        run_update(query)
        return {"message": "Notification supprimée avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL (delete_notification): {str(e)}")
    

@app.post("/notifications/read-all")
def mark_all_as_read():
    """
    Marque toutes les notifications comme lues pour un étudiant connecté.
    (Tu peux ajouter un champ `lu` dans ton modèle RDF ou Firestore)
    """
    query = PREFIX + """
    DELETE { ?n :lu ?old . }
    INSERT { ?n :lu true . }
    WHERE { ?n a :Notification . OPTIONAL { ?n :lu ?old . } }
    """
    run_update(query)
    return {"message": "Notifications marquées comme lues"}




import random

def generate_consigne_local(titre: str) -> str:
    """
    Génère une consigne professionnelle et adaptée au domaine du devoir.
    (Sans API externe)
    """
    titre = titre.strip().capitalize()
    if not titre:
        return "Veuillez saisir un titre de devoir valide."

    # Analyse du domaine du devoir
    titre_lower = titre.lower()

    # Mathématiques
    if any(word in titre_lower for word in ["math", "algèbre", "géométrie", "équation", "fonction", "probabilité", "statistique"]):
        modèles = [
            f"Résolvez une série d'exercices portant sur '{titre}', incluant des démonstrations, calculs algébriques et interprétations graphiques.",
            f"Élaborez un devoir comprenant au moins trois problèmes liés à '{titre}', en détaillant chaque étape du raisonnement.",
            f"Rédigez un exposé expliquant les principes de '{titre}' à travers des exemples concrets et des formules mathématiques.",
        ]

    # Physique / Chimie
    elif any(word in titre_lower for word in ["physique", "énergie", "mouvement", "force", "chimie", "réaction", "atome"]):
        modèles = [
            f"Réalisez un rapport expérimental sur '{titre}', en décrivant la théorie, le protocole et les résultats observés.",
            f"Rédigez un devoir expliquant les lois et principes fondamentaux liés à '{titre}' avec des schémas et équations.",
            f"Proposez une expérience simulée ou réelle autour de '{titre}', et discutez de l’interprétation des résultats.",
        ]

    # Français / Langues
    elif any(word in titre_lower for word in ["français", "littérature", "texte", "poésie", "rédaction", "langue", "expression"]):
        modèles = [
            f"Rédigez un texte argumentatif sur '{titre}', en respectant la structure introduction-développement-conclusion.",
            f"Analysez un extrait littéraire lié à '{titre}' et commentez les figures de style et le message de l’auteur.",
            f"Écrivez une rédaction créative sur le thème de '{titre}', en respectant les règles grammaticales et stylistiques.",
        ]

    # Histoire / Géographie
    elif any(word in titre_lower for word in ["histoire", "guerre", "civilisation", "empire", "révolution", "géographie", "climat"]):
        modèles = [
            f"Rédigez une dissertation sur '{titre}' en analysant les causes, le déroulement et les conséquences historiques.",
            f"Préparez un exposé structuré sur '{titre}', avec des repères chronologiques et des cartes explicatives.",
            f"Rédigez une synthèse sur '{titre}' mettant en évidence les principaux acteurs et les enjeux de l’époque.",
        ]

    # Informatique / Technologie
    elif any(word in titre_lower for word in ["informatique", "programmation", "réseau", "algorithme", "base de données", "web"]):
        modèles = [
            f"Développez un mini-projet pratique sur '{titre}' en incluant le code source et une explication détaillée.",
            f"Rédigez un rapport technique décrivant la conception et le fonctionnement d’un programme lié à '{titre}'.",
            f"Réalisez un tutoriel étape par étape pour expliquer le concept de '{titre}' avec un exemple d’application.",
        ]

    # Sciences humaines / Philosophie
    elif any(word in titre_lower for word in ["philosophie", "psychologie", "sociologie", "morale", "valeur", "conscience"]):
        modèles = [
            f"Rédigez une dissertation philosophique sur '{titre}', en formulant une problématique et un plan structuré.",
            f"Développez un essai critique sur '{titre}', en argumentant à partir d’auteurs et de concepts étudiés en cours.",
            f"Rédigez une réflexion personnelle sur '{titre}', en discutant des implications morales et sociales.",
        ]

    # Par défaut : modèle général
    else:
        modèles = [
            f"Rédigez un exposé complet sur le thème de '{titre}', avec une introduction, un développement et une conclusion.",
            f"Préparez un rapport détaillé sur '{titre}' en illustrant vos propos par des exemples concrets.",
            f"Faites une recherche sur '{titre}' et résumez vos conclusions dans un texte structuré et argumenté.",
        ]

    # Choix aléatoire parmi les consignes proposées
    return random.choice(modèles)


# --- Route FastAPI locale ---
@app.post("/generate_consigne_local")
async def generate_consigne_local_api(request: Request):
    """
    Endpoint local : génère une consigne sans appel à une API externe.
    """
    data = await request.json()
    titre = data.get("titreDevoir", "").strip()

    if not titre:
        raise HTTPException(status_code=400, detail="Le titre du devoir est requis")

    consigne = generate_consigne_local(titre)
    return {"titreDevoir": titre, "consigne": consigne}




# --- Fonction pour générer la description ---
def generer_description_locale(titre: str, type_projet: str) -> str:
    """
    Génère une description automatique selon le titre ou le type du projet.
    (Sans API externe)
    """
    titre = titre.strip().capitalize()
    type_projet = (type_projet or "").lower()

    if not titre:
        return "Veuillez saisir un titre de projet valide."

    titre_lower = titre.lower()

    # --- Catégories par mot-clé ---
    if any(word in titre_lower for word in ["ia", "intelligence artificielle", "machine learning", "data", "deep learning"]):
        modèles = [
            f"Projet centré sur l'intelligence artificielle, appliqué au domaine de '{titre}'.",
            f"Étude et développement d’un système intelligent lié à '{titre}', exploitant l’apprentissage automatique.",
            f"Conception d’un modèle IA innovant pour le projet '{titre}'."
        ]

    elif any(word in titre_lower for word in ["web", "site", "html", "css", "react", "node", "frontend", "backend"]):
        modèles = [
            f"Développement d’une application web moderne autour de '{titre}', intégrant les technologies les plus récentes.",
            f"Projet web axé sur la conception, la performance et l’expérience utilisateur en lien avec '{titre}'.",
            f"Création d’un site complet pour le thème '{titre}', combinant design et fonctionnalité."
        ]

    elif any(word in titre_lower for word in ["mobile", "android", "ios", "flutter", "application mobile"]):
        modèles = [
            f"Conception d’une application mobile innovante basée sur '{titre}', avec une interface fluide et intuitive.",
            f"Développement mobile autour de '{titre}', exploitant les fonctionnalités natives des appareils modernes.",
            f"Projet mobile mettant en avant l’ergonomie et la simplicité d’usage sur le thème '{titre}'."
        ]

    elif any(word in titre_lower for word in ["écologie", "durable", "environnement", "énergie", "climat"]):
        modèles = [
            f"Projet environnemental visant à promouvoir la durabilité à travers '{titre}'.",
            f"Étude et conception d’un projet vert autour de '{titre}', liant innovation et écologie.",
            f"Initiative durable axée sur '{titre}', favorisant la sensibilisation environnementale."
        ]

    elif any(word in titre_lower for word in ["gestion", "finance", "entreprise", "économie", "marketing", "management"]):
        modèles = [
            f"Projet de gestion portant sur '{titre}', combinant stratégie, planification et prise de décision.",
            f"Étude pratique sur '{titre}', appliquant les principes du management et de l’analyse financière.",
            f"Projet entrepreneurial innovant sur le thème '{titre}'."
        ]

    elif any(word in titre_lower for word in ["éducation", "formation", "apprentissage", "cours", "enseignement"]):
        modèles = [
            f"Projet éducatif sur '{titre}', visant à renforcer les méthodes d’enseignement et d’apprentissage.",
            f"Développement d’un outil pédagogique interactif centré sur '{titre}'.",
            f"Conception d’une plateforme de formation dédiée à '{titre}'."
        ]

    else:
        modèles = [
            f"Projet académique complet sur '{titre}', permettant d’appliquer les connaissances acquises durant la formation.",
            f"Réalisation d’un projet professionnel sur '{titre}', combinant conception, analyse et mise en œuvre.",
            f"Travail de synthèse sur le thème '{titre}', axé sur l’innovation et la pratique."
        ]

    # Adaptation selon le type du projet
    if type_projet == "groupe":
        return random.choice(modèles) + " Ce projet sera réalisé en groupe pour favoriser la collaboration."
    elif type_projet == "individuel":
        return random.choice(modèles) + " Ce projet individuel permettra de démontrer l’autonomie et la rigueur de l’étudiant."
    else:
        return random.choice(modèles)


# --- Route d’API appelée par ton frontend ---
@app.post("/generer_description")
async def generer_description(request: Request):
    """
    Génère automatiquement une description en fonction du titre ou du type du projet.
    """
    data = await request.json()
    titre = data.get("titreProjet", "").strip()
    type_projet = data.get("typeProjet", "").strip()

    if not titre:
        raise HTTPException(status_code=400, detail="Le titre du projet est requis")

    description = generer_description_locale(titre, type_projet)
    return {"descriptionProjet": description}