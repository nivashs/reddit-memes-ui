import { Link, useLocation } from 'react-router-dom';
import { ChartBarIcon, ClockIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Top Memes', href: '/', icon: PhotoIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}