// client/src/App.js
import { Routes, Route } from 'react-router-dom';
import { PollProvider } from './context/PollContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import PollPage from './pages/PollPage';
import NotFound from './pages/NotFound';
import PollResultsPage from './pages/PollResultsPage';
import Features from './pages/Features';
import JoinPoll from './pages/JoinPoll';
import ResultsLookup from './pages/ResultsLookup';
import './App.css';
import './styles/Home.css';
import './styles/PollPage.css';
import './pages/CreatePoll.css';

function App() {
  return (
    <PollProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePoll />} />
            <Route path="/features" element={<Features />} />
            <Route path="/join" element={<JoinPoll />} />
            <Route path="/results" element={<ResultsLookup />} />
            <Route path="/poll/:id" element={<PollPage />} />
            <Route path="/poll/:id/results" element={<PollResultsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PollProvider>
  );
}

export default App;
