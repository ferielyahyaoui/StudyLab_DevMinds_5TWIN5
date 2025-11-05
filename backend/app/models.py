from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignup(BaseModel):
    nom: str
    prenom: str
    email: Optional[EmailStr] = ""
    adresse: Optional[str] = ""
    dateNaissance: Optional[str] = ""  # YYYY-MM-DD
    motdepasse: Optional[str] = ""
    telephone: Optional[str] = ""
    role: str  # "Etudiant" ou "Enseignant"
    matricule: Optional[str] = ""
    niveau: Optional[str] = ""
    salaire: Optional[float] = 0

class UserSignin(BaseModel):
    email: str
    motdepasse: str

class Course(BaseModel):
    codeCours: str
    nomCours: str
    volumeHoraire: int