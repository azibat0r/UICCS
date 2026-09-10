import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import SurveyBanner from './components/SurveyBanner.jsx';
import Home from './pages/Home.jsx';
import InternshipFeed from './pages/InternshipFeed.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import StudyGroups from './pages/StudyGroups.jsx';
import Profile from './pages/Profile.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text) overflow-x-hidden">
      <Navbar />
      <SurveyBanner />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<InternshipFeed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/groups" element={<StudyGroups />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
