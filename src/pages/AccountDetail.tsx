import React from 'react';
import { useParams } from 'react-router-dom';

export function AccountDetail() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Account Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account ID</label>
                <p className="mt-1 text-sm text-gray-900">{id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <p className="mt-1 text-sm text-gray-900">Main Account</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="mt-1 text-sm text-gray-900">Business</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                <p className="mt-1 text-sm text-gray-900">$10,000.00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Transaction</label>
                <p className="mt-1 text-sm text-gray-900">2025-01-15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
