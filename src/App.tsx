import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HardwarePage from './pages/HardwarePage';
import RecommendPage from './pages/RecommendPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hardware" element={<HardwarePage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
