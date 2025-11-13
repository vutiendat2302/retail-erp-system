import  React, {useState} from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Eye, LogIn,EyeOff } from 'lucide-react';
import {toast} from 'sonner'
import { Input } from '../components/ui/input';
import logo from '@/assets/picture/logo.png';
interface LoginFormProps {
  onLogin: (useData: {username: string, role: string}) => void;
}

const mockUsers = {
    'admin': { password: 'admin123', role: 'Quản trị viên', fullName: 'Vu Tien Dat' },
  };

export function LoginForm({onLogin}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const user = mockUsers[username as keyof typeof mockUsers];

    if (user && user.password === password) {
      console.log("Đăng nhập thành công");
      toast.success("Đăng nhập thành công");

      onLogin({
      username: user.fullName,
      role: user.role
      });
    } else {
      console.log("Đăng nhập thất bại")
      setError('Tên đăng nhập hoặc mật khẩu bị sai');
      toast.error('Đăng nhập thất bại');
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[url('/login.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen w-full flex items-center">
        <div className='absolute inset-0 bg-white/20'/>
        {/* Logo */}
        <div className="hidden md:w-1/2 md:flex items-center justify-center h-full">
            <div className="relative m-auto text-center px-8 text-text-primary">
              <h1 className="font-weight-bold font-inter text-7xl mb-4 title">WareHouse Pro</h1>
              <p className="text-2xl font-weight-medium opacity-80 font-inter content text-text-primary">Hệ thống quản lý thông minh</p>
              <div className='flex items-center justify-center mt-8 opacity-90'>
                <img src={logo} alt="Login" className=" h-60 w-auto object-cover flex opacity-80"/>
              </div>
            </div>
            
        </div>

        <div className='flex w-full md:w-1/2 items-center justify-center'>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-lg w-full max-w-md">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="font-inter font-semibold font-size-lg">Đăng nhập</CardTitle>
              <CardDescription className='font-inter opacity-90'>
                Nhập thông tin để truy cập hệ thống
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className='font-inter text-nm font-weight-semibold'>Tên đăng nhập: </Label>
                  <div className="relative mt-1">
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 text-sm font-inter"
                      placeholder="Nhập tên đăng nhập"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className='font-inter text-nm font-weight-semibold'>Mật khẩu: </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 text-sm font-inter"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full button-color"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Đang đăng nhập...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      <span className='font-inter font-size-sm font-normal'>Đăng nhập</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Login Info */}
              <div className="button-color p-3 rounded-lg">
                <p className="text-xs font-inter ">
                  <strong>Thông tin đăng nhập:</strong><br />
                  • admin/admin123 (Quản trị viên)<br />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}