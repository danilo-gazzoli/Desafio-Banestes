import React from 'react';
// importa biblioteca usada para gerenciar rotas
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// exporta a funcao do componente
export function Breadcrumb() {
  // instacia o objeto useLocation
  const location = useLocation();

  // utilzia a funcao pathname para dividir a url atual e filtrar os caminhos
  const pathnames = location.pathname.split('/').filter(x => x);

  // mapeia os caminhos para textos em portugues
  const breadcrumbMap: { [key: string]: string } = {
    clients: 'Clientes',
    agencies: 'Agências',
    accounts: 'Contas',
    chat: 'Chat AI'
  };

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#004B8D]"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          // reconstroi a rota ate o nivel atual
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

          // verifica se e o ultimo nivel
          const isLast = index === pathnames.length - 1;

          // escolhe o texto a ser exibido   
          const displayName = breadcrumbMap[name] || name;

          return (
            <li key={name} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {isLast ? (
                // nivel atual: texto sem link, destacado em outra cor
                <span className="ml-1 text-sm font-medium text-[#004B8D]">
                  {displayName}
                </span>
              ) : (
                // niveis anteriores: links clicaveis  
                <Link
                  to={routeTo}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-[#004B8D]"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
