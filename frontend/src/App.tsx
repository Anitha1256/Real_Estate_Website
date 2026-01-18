import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Properties from './pages/Properties.tsx';
import PropertyDetail from './pages/PropertyDetail.tsx';
import AddProperty from './pages/AddProperty.tsx';
import MapPage from './pages/MapPage.tsx';
import Profile from './pages/Profile.tsx';
import Agents from './pages/Agents.tsx';
import AgentProfile from './pages/AgentProfile.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import EditProperty from './pages/EditProperty.tsx';
import AuthGuard from './components/AuthGuard.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<AuthGuard><PropertyDetail /></AuthGuard>} />
              <Route path="/add-property" element={<AuthGuard><AddProperty /></AuthGuard>} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:id" element={<AuthGuard><AgentProfile /></AuthGuard>} />
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/edit-property/:id" element={<AuthGuard><EditProperty /></AuthGuard>} />
              <Route path="/admin-dashboard" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
            </Routes >
          </main >
          <footer className="bg-slate-900 text-white py-12 px-6 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <h3 className="text-2xl font-bold mb-4">EstatePro</h3>
                <p className="text-slate-400 max-w-sm">
                  Discover your dream home with the most trusted real estate platform. We provide premium listings and expert agent support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-slate-100">Quick Links</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/properties" className="hover:text-primary-400 transition-colors">Properties Catalog</Link></li>
                  <li><Link to="/agents" className="hover:text-primary-400 transition-colors">Elite Agents</Link></li>
                  <li><Link to="/map" className="hover:text-primary-400 transition-colors">Interactive Map</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-slate-100">Contact</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>contact@estatepro.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>123 Real Estate Ave, CA</li>
                </ul>
              </div>
            </div>
          </footer>
        </div >
        <ToastContainer position="bottom-right" theme="colored" />
      </Router >
    </AuthProvider >
  );
}

export default App;
