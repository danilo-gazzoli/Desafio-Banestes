import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// importa os icones
import { Users, Building2, CreditCard, Menu, X, MessageSquare, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

// define que o componente recebe o conteudo interno
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // controla a barra lateral na tela mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // instacia o objeto useLocation com a funcao pathname
  const location = useLocation();

  // referencia ao botao que abre e fecha o menu
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  // container do menu
  const menuRef = React.useRef<HTMLDivElement>(null);

  // realiza o efeito de esconder o menu ao clicar fora
  React.useEffect(() => {
    // se o usuario fizer um clique, verifica se foi dentro ou fora do menu do botao
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // se sim 
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        // define o menu mobile como falso
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // lista de objetos das secoes com nome e rota
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Agências', href: '/agencies', icon: Building2 },
    { name: 'Contas', href: '/accounts', icon: CreditCard },
    { name: 'Chat AI', href: '/chat', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* botao de menu do mobile */}
      { /* renderiza apenas em telas menores que lg devido a tag lg:hidden */ }
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          ref={menuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#004B8D]"
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu principal"
        >
          { /* alterna isMobileMenuOpen ao clicar e exibe o icone de menu */}
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

      {/* secao principal */}
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
