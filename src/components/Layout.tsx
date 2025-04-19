import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Building2, CreditCard, Menu, X, MessageSquare, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Agências', href: '/agencies', icon: Building2 },
    { name: 'Contas', href: '/accounts', icon: CreditCard },
    { name: 'Chat AI', href: '/chat', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          ref={menuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#004B8D]"
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu principal"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        ref={menuRef}
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Navegação principal"
      >
        <div className="h-16 flex items-center justify-center border-b bg-[#004B8D]">
          <h1 className="text-xl font-semibold text-white">Banestes</h1>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#004B8D]",
                  isActive
                    ? "text-white bg-[#004B8D]"
                    : "text-gray-600 hover:text-[#004B8D] hover:bg-gray-50"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={clsx(
          "transition-all duration-200 ease-in-out",
          "lg:ml-64 min-h-screen"
        )}
        id="main-content"
      >
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}