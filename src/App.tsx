import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { DataProvider } from './contexts/DataProvider';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Home />} />
          <Route path="/search" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;