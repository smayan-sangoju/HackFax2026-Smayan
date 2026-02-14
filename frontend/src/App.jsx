import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Symptoms from './pages/Symptoms';
import Diagnosis from './pages/Diagnosis';
import Ranked from './pages/Ranked';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <main className="app">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Symptoms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/ranked" element={<Ranked />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
