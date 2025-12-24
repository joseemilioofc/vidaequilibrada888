import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  LogIn,
  Moon,
  Sun,
  ShieldCheck,
  X
} from 'lucide-react';

interface MobileNavProps {
  isAdmin?: boolean;
}

const MobileNav = ({ isAdmin = false }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', href: '/admin', icon: ShieldCheck });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 bg-background border-border">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-display font-semibold text-foreground">
              EquilíbrioVida
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6 space-y-4">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="w-full gap-2"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                Modo escuro
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                Modo claro
              </>
            )}
          </Button>

          {user ? (
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate('/auth');
                setOpen(false);
              }}
              className="w-full gap-2"
            >
              <LogIn className="w-5 h-5" />
              Entrar
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;