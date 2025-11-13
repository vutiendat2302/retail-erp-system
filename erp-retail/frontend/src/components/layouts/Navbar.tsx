import React, { useState, useContext } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/motion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AuthContext } from './MainLayout';
import logo from '@/assets/picture/logo.png';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  Package,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowDown,
  ChevronDown
} from 'lucide-react';
import { Arrow, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';

interface NavLink {
  href: string;
  label: string;
}

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const posLink: NavLink[] = [
    {href: '/post-of-link', label: "Quản Lý Bán hàng"}
  ];

  const reportLink: NavLink[] = [
    {href: '/report', label: 'Báo Cáo'}
  ];

  const dashboardLink: NavLink[] = [
    {href: '/', label: 'Trang Chủ'},
  ];

  const dropdownHRMLinks: NavLink[] = [
    { href: '/employee', label: 'Nhân Viên' },
    { href: '/schedule', label: 'Lịch Làm Việc' },
    { href: '/attendance', label: 'Điểm Danh' },
  ];

  const dropdownInventoryLinks: NavLink[] = [
    {href: '/inventory', label: 'Hàng Tồn Kho'},
    {href: '/book', label: 'Nhập Hàng'},
    {href: '/return', label: 'Trả Hàng'},
    {href: '/supplier', label: 'Nhà Cung Cấp'},
    {href: '/batch-product', label: 'Lô Hàng'},
  ]

  const dropdownProductLinks: NavLink[] = [
    {href: '/product', label: 'Danh Sách Sản Phẩm '},
    {href: '/category', label: 'Danh Mục Sản Phẩm'},
    {href: '/brand', label: 'Thương Hiệu'},
  ]

  const mobileNavItems = [
    ...dashboardLink,
    ...posLink,
    ...reportLink,
    ...dropdownHRMLinks,
    ...dropdownInventoryLinks,
    ...dropdownProductLinks,
  ];

  const isDropdownHRMActive = dropdownHRMLinks.some(link => location.pathname === link.href);
  const isDropdownIventoryActive = dropdownInventoryLinks.some(link => location.pathname === link.href);
  const isDropdownProductActive = dropdownProductLinks.some(link => location.pathname === link.href);
  const [openDropdownHRM, setOpenDropdownHRM] = useState(false);
  const [openDropdownInventory, setOpenDropdownInventory] = useState(false);
  const [openDropdownProduct, setOpenDropdownProduct] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // login, logout
  const authContext = useContext(AuthContext);
  if (!authContext) {
    console.error("Author Null");
    return null;
  }
  const { userData, onLogout } = authContext;

  return (
    <header className="sticky top-0 z-50 w-full border-opacity-80 header">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/')}
              className='relative p-2 rounded-full transition-colors hover:bg-foreground/10 flex items-center justify-center'
            >
              <img src = {logo} alt = "logo" className = "h-18 w-auto" />
              <span className="font-bold text-2xl hidden sm:inline-block">WinMart Pro</span>
              <span className="font-bold text-lg sm:hidden">WM Pro</span>
            </button>
            
          </div>

        <div className='flex items-center justify-center'>
          <motion.div className="hidden md:flex items-center justify-between space-x-10 font-weight-semibold font-sans font-size-md ml-auto" variants={fadeIn('down',  0.3)}>
          <div>
            {/* Desktop Menu */}
              {dashboardLink.map((link, index) => (
                  <button
                    key = {index}
                    onClick={() => navigate(link.href)}
                    className={`transition-colors hover:text-gray-700 text-black/80 font-weight-semibold font-sans !text-sm ${
                    location.pathname === link.href
                      ? 'text-foreground border-b-2 border-line pb-1'
                      : 'text-foreground/60'
                    }`}
                  >
                    {link.label}
                  </button>
              ))}
          </div>

          <div>
            {/* Dropdown HRM*/}
              <DropdownMenu open={openDropdownHRM} onOpenChange={setOpenDropdownHRM}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={` relative transition-colors  hover:text-gray-700 text-black/80 !text-sm ${
                      isDropdownHRMActive ? 'text-foreground border-b-2 border-line pb-1' : 'text-foreground/60'
                    }`}
                  >
                    <span className='font-sans font-weight-medium flex items-center'>
                    Quản Lý Nhân Viên <ChevronDown className='opacity-40 w-5 h-auto'/>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 -mt-2 z-20 header" align="center" sideOffset={18} forceMount>
                  <DropdownMenuLabel className='font-size-nm font-sans font-weight-md'>
                    <div className="flex flex-col space-y-1">
                      
                      {dropdownHRMLinks.map((link, index) => (
                        <DropdownMenuItem asChild key = {index}>
                          <motion.button
                            onClick={() => {
                              setOpenDropdownHRM(false);
                              navigate(link.href);
                            }}
                              className={` relative transition-colors hover:text-foreground/80 ${
                              location.pathname === link.href
                                ? 'button-color text-foreground'
                                : 'text-foreground/60'
                              }`}
                              style={{ textDecoration: "none", color: "inherit" }}
                              variants={fadeIn('down', 0.4 + index * 0.1)}
                            >
                              {link.label}
                          </motion.button>
                        </DropdownMenuItem>
                        ))}
                        
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              {/* Dropdown Warehouse*/}
              <DropdownMenu  open={openDropdownInventory} onOpenChange={setOpenDropdownInventory}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative transition-colors  hover:text-gray-700 text-black/80 font-sans font-weight-medium !text-sm ${
                      isDropdownIventoryActive ? 'text-foreground border-b-2 border-line pb-1' : 'text-foreground/60'
                    }`}
                  >
                    <span className = "font-sans font-weight-medium flex items-center">
                      Quản Lý Kho <ChevronDown className='opacity-40 w-5 h-auto'/>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 -mt-2 z-20 header' align="center" sideOffset={18} forceMount>
                  <DropdownMenuLabel className='font-size-nm'>
                    <div className="flex flex-col space-y-1">
                      {dropdownInventoryLinks.map((link, index) => (
                        <DropdownMenuItem asChild key = {index}>
                          <motion.button
                            onClick={() => {
                              setOpenDropdownInventory(false);
                              navigate(link.href);
                            }}
                              className={` relative transition-colors hover:text-foreground/80 ${
                              location.pathname === link.href
                                ? 'button-color text-foreground'
                                : 'text-foreground/60'
                              }`}
                              style={{ textDecoration: "none", color: "inherit" }}
                              variants={fadeIn('down', 0.4 + index * 0.1)}
                            >
                              {link.label}
                          </motion.button>
                        </DropdownMenuItem>
                        ))}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              {/* Dropdown Product*/}
              <DropdownMenu  open={openDropdownProduct} onOpenChange={setOpenDropdownProduct}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative transition-colors  hover:text-gray-700 text-black/80 font-sans font-weight-medium !text-sm ${
                      isDropdownProductActive ? 'text-foreground border-b-2 border-line pb-1' : 'text-foreground/60'
                    }`}
                  >
                    <span className = "font-sans font-weight-medium flex items-center">
                      Quản Lý Sản Phẩm <ChevronDown className='opacity-40 w-5 h-auto'/>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 -mt-2 z-20 header' align="center" sideOffset={18} forceMount>
                  <DropdownMenuLabel className='font-size-nm'>
                    <div className="flex flex-col space-y-1">
                      {dropdownProductLinks.map((link, index) => (
                        <DropdownMenuItem asChild key = {index}>
                          <motion.button
                            onClick={() => {
                              setOpenDropdownProduct(false);
                              navigate(link.href);
                            }}
                              className={` relative transition-colors hover:text-foreground/80 ${
                              location.pathname === link.href
                                ? 'text-foreground button-color'
                                : 'text-foreground/60'
                              }`}
                              style={{ textDecoration: "none", color: "inherit" }}
                              variants={fadeIn('down', 0.4 + index * 0.1)}
                            >
                              {link.label}
                          </motion.button>
                        </DropdownMenuItem>
                        ))}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
            {/* Pos Of Sale */}
              {posLink.map((link, index) => (
                  <button
                    key = {index}
                    onClick={() => navigate(link.href)}
                    className={`transition-colors  hover:text-gray-700 text-black/80 font-sans font-weight-medium !text-sm ${
                    location.pathname === link.href
                      ? 'text-foreground border-b-2 border-line pb-1'
                      : 'text-foreground/60'
                    }`}
                  >
                    {link.label}
                  </button>
              ))}
            </div>

            <div>
            {/* Report */}
              {reportLink.map((link, index) => (
                  <button
                    key = {index}
                    onClick={() => navigate(link.href)}
                    className={`transition-colors  hover:text-gray-700 text-black/80 font-sans font-weight-medium !text-sm ${
                    location.pathname === link.href
                      ? 'text-foreground border-b-2 border-line pb-1'
                      : 'text-foreground/60'
                    }`}
                  >
                    {link.label}
                  </button>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 !rounded-full transition-colors hover:bg-foreground/10">
            <Bell className="h-5 w-6" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs text-text-secondary font-weight-bold bg-red-200"
            >
              3
            </Badge>
          </button>
          {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-6 w-6 rounded-full">
                    <User className="!h-6 !w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-20 mt-2.5 header" align="end" forceMount>
                  <DropdownMenuLabel className='font-size-nm font-weight-semibold'>
                    <div className='flex flex-col space-y-1 mt-3'>
                      <p className='font-size-sm front-weight-medium leading-none'>
                        <span className = "opacity-70">
                          Tài khoản:
                        </span> {" "}
                         {userData?.username || 'Unknow User'}
                      </p>
                      <p className="font-size-sm front-weight-medium leading-none">
                        <span className='opacity-70'>
                          Chức danh:
                        </span> {''}
                        {userData?.role || 'No Role'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem>
                    <Button onClick={onLogout} className='bg-background-primary w-full !rounded-md items-center'>
                      <LogOut className='text-[var(--color-text-background)]'/>
                      <span className='flex font-weight-medium font-sans font-size-sm text-[var(--color-text-background)]'>Đăng xuất</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          {/* Settings */}
          <button className="relative p-2 !rounded-full transition-colors hover:bg-foreground/10">
            <Settings className="h-6 w-6" />
          </button>

          {/* Menu */}
          <Button
            variant="ghost"
            className='md:hidden'
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-1 p-4">
            {mobileNavItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
