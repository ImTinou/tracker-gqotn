import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItemPage from './pages/ItemPage';

function App() {
  return (
    <Router basename="/tracker-gqotn">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:itemId" element={<ItemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
