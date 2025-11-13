import React, {createContext} from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

interface UserData {
  username: string;
  role: string;
}

interface AuthContextType {
  userData: UserData | null;
  onLogout: () => void;
}

interface MainLayoutProps {
  userData: UserData | null;
  onLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const MainLayout: React.FC<MainLayoutProps> = ({ userData, onLogout }) => {
  return (
    <AuthContext.Provider value={{ userData, onLogout }}>
      <>

        <Navbar />
        <main className="flex justify-center p-4 mt-16 ">
          <div className='w-full max-w-[1400px] min-h-[calc(100vh-64px)] shadow p-6'>
            <Outlet />
          </div>
        </main>
        <Footer />
      </>
    </AuthContext.Provider>
  );
};

export default MainLayout;
