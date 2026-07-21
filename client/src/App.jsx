import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import InternshipFeed from './pages/InternshipFeed.jsx';
import Contact from './pages/Contact.jsx';

function App() {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<InternshipFeed />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;