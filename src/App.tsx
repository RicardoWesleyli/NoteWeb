import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { DataProvider } from './contexts/DataProvider';
import { ToastProvider } from './components/Toast/ToastContext';

function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Home />} />
            <Route path="/search" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ToastProvider>
  );
}

export default App;