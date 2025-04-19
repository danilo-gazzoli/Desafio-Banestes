import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ClientList } from './pages/ClientList';
import { ClientDetail } from './pages/ClientDetail';
import { AgencyList } from './pages/AgencyList';
import { AgencyDetail } from './pages/AgencyDetail';
import { AccountList } from './pages/AccountList';
import { Dashboard } from './pages/Dashboard';
import { ChatAI } from './pages/ChatAI';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/agencies" element={<AgencyList />} />
          <Route path="/agencies/:id" element={<AgencyDetail />} />
          <Route path="/accounts" element={<AccountList />} />
          <Route path="/chat" element={<ChatAI />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;