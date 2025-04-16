import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgencias } from '../services/getData';
import { Agencia } from '../types';
import { ArrowLeft, Loader } from 'lucide-react';

export function AgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = React.useState<Agencia | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        const agencies = await getAgencias();
        const foundAgency = agencies.find(a => a.id === id);
        
        if (foundAgency) {
          setAgency(foundAgency);
        } else {
          setError('Agency not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading agency details');
        setLoading(false);
      }
    };

    fetchAgencyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Agency not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/agencies')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Agencies
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Agency Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency Code</label>
                <p className="mt-1 text-sm text-gray-900">{agency.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{agency.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{agency.endereco}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-700">
                This agency is part of our network and provides full banking services to our clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
