import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Employee from './pages/Employee';
import Schedule from './pages/Schedule';
import Attendance from 'p/Attendance';
import Dashboard from 'p/Dashboard';
import { useState, useEffect } from 'react';
import { Report } from './components/ui/Report';
import Warehouse from './pages/inventory-page/Warehouse';
import Product from './pages/inventory-page/Product';
import { LoginForm } from './pages/Login';
import POSPage from './pages/POSPage';
import {Category} from './pages/inventory-page/Category';
import { Brand } from './pages/inventory-page/Brand';
import { Supplier } from './pages/inventory-page/Supplier';
import OrderManagementPage from './pages/OrderManagementPage';
import PromoCodeManagementPage from './pages/PromoCodeManagementPage';
import { Toaster } from 'sonner';
import ImportPage from './pages/inventory-page/ImportPage';

interface UserData {
  username: string;
  role: string;
}

export type PageType = 'pos' | 'orders' | 'promocodes';

const AppRouter = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const handleLogin = (user: UserData) => {
    setUserData(user);
    console.log("User data set:", user);
    navigate('/');
  };

  const handleLogout = () => {
    setUserData(null);
    navigate('/login');
  };
  

  useEffect(() => {
    if (!userData && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [userData, navigate]);

  return (
    
    <Routes>
      <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
      <Route
        path="/"
        element={<MainLayout userData={userData} onLogout={handleLogout} />}
      >
        <Route index element={<Dashboard />} />
        <Route path='employee' element={<Employee />} />
        <Route path='schedule' element={<Schedule />} />
        <Route path='attendance' element={<Attendance />} />
        <Route path='inventory' element={<Warehouse />} />
        <Route path='report' element={<Report />} />
        <Route path='product' element={<Product />} />
        <Route path='post-of-link' element={<POSPage/>} />
        <Route path = 'category' element={<Category />} />
        <Route path = 'brand' element = {<Brand />} />
        <Route path = 'supplier' element = {<Supplier />} />
        <Route path = 'book' element = {<ImportPage />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster />
    </BrowserRouter>
  );
}
