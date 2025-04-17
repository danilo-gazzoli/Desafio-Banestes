import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

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
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbMap[name] || name;

          return (
            <li key={name} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-[#004B8D]">
                  {displayName}
                </span>
              ) : (
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