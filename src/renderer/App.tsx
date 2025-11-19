import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import NewRental from './pages/NewRental';
import OngoingRentals from './pages/OngoingRentals';
import RenterSearch from './pages/RenterSearch';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<Items />} />
          <Route path="new-rental" element={<NewRental />} />
          <Route path="ongoing-rentals" element={<OngoingRentals />} />
          <Route path="renter-search" element={<RenterSearch />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
