import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  // Ta conversion index.html
import SignIn from './pages/SignIn';  // Page de connexion
import SignUp from './pages/SignUp';  // Page d'inscription
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Courses from './pages/Courses';
import Chapitres from './pages/Chapitres'; 
import Support from './pages/Support';
import Examens from './pages/Examens';
import Exercices from './pages/Exercices';
import Soutenance from './pages/Soutenance';
import CoursEnLigne from './pages/CoursEnLigne';
import Devoir from './pages/Devoir';
import Departement from './pages/Departement';
import Classe from './pages/Classe';
import Institution from './pages/Institutions';
import Note from './pages/Note';
import Diplome from './pages/Diplome';
import Attestation from './pages/Attestation';
import Matiere from './pages/Matiere';
import Projet from './pages/Projet';
import Competence from './pages/Competence';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Ajoute pour autres pages du template */}
        <Route path="/about" element={<About/>} />
        <Route path="/course" element={<Courses/>} />
        <Route path="/instructor" element={<div>Instructor Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        <Route path="/signin" element={<SignIn/>} />
         <Route path="/signup" element={<SignUp/>} />
        <Route path="/userprofile" element={<UserProfile/>} />
        <Route path="/chapitres" element={<Chapitres/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/examens" element={<Examens/>} />
        <Route path="/exercices" element={<Exercices/>} />
        <Route path="/soutenance" element={<Soutenance/>} />
        <Route path="/coursenligne" element={<CoursEnLigne/>} />
        <Route path="/devoir" element={<Devoir/>} />
        <Route path="/departement" element={<Departement/>} />
        <Route path="/classe" element={<Classe/>} />
        <Route path="/institutions" element={<Institution/>} />  
        <Route path="/note" element={<Note/>} />
        <Route path="/diplome" element={<Diplome/>} />
        <Route path="/attestation" element={<Attestation/>} />
        <Route path="/matiere" element={<Matiere/>} /> 
        <Route path="/projets" element={<Projet/>} />
        <Route path="/competence" element={<Competence/>} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/forgot" element={<ForgotPassword/>}/>

         
      </Routes>
    </Router>
  );
}

export default App;