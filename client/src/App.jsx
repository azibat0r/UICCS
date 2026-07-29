import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SurveyBanner from './components/SurveyBanner.jsx';
import Home from './pages/Home.jsx';
import InternshipFeed from './pages/InternshipFeed.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import StudyGroups from './pages/StudyGroups.jsx';
import Profile from './pages/Profile.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

function App() {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <Navbar />
      <SurveyBanner />
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<InternshipFeed />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/groups" element={<StudyGroups />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;