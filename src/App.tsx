import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import TailedBeasts from "./pages/TailedBeasts";
import Clans from "./pages/Clans";
import Vilage from "./pages/Vilage";
import CharacterDetail from "./pages/CharacterDetail";
import VillageDetail from "./pages/VillageDetail";
import ClanDetail from "./pages/ClanDetail";
import TailedBeastDetail from "./pages/TailedBeastDetail";
import Footer from "./components/footer";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/village" element={<Vilage />} />
          <Route path="/clans" element={<Clans />} />
          <Route path="/clans" element={<Clans />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/villages/:id" element={<VillageDetail />} />
          <Route path="/clans/:id" element={<ClanDetail />} />
          <Route path="/tailed-beasts" element={<TailedBeasts />} />
          <Route path="/tailed-beasts/:id" element={<TailedBeastDetail />} />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
