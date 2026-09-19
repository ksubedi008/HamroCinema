import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const LoyaltyHistory = () => {
  const { authTokens, user, fetchCurrentUser } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await fetchCurrentUser(); // Silently re-fetch global user profile
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/me/loyalty-transactions/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    if (authTokens) {
      fetchTransactions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-40 min-h-screen">
        <div className="w-12 h-12 border-4 border-neutral-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg text-lg font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-100 uppercase tracking-widest">
            Loyalty Ledger
          </h1>
          <p className="text-neutral-400 mt-2">
            Track your earned and spent points
          </p>
        </div>
        
        {/* Dynamically sum transactions to guarantee it perfectly matches the ledger */}
        <div className="bg-[#1A1A1A] px-6 py-4 rounded-xl border border-neutral-800 shadow-md">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
            Current Balance
          </p>
          <p className="text-3xl font-black text-neutral-100">
            {transactions.reduce((acc, tx) => acc + tx.amount, 0)}
          </p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#121212]/50">
                <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-800/30 transition-colors duration-200 ease-in-out">
                    <td className="py-4 px-6 text-sm text-neutral-300">
                      {new Date(tx.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className="bg-[#121212] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-neutral-400 border border-neutral-800">
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-300">
                      {tx.description}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-right">
                      {tx.amount > 0 ? (
                        <span className="text-emerald-400">+{tx.amount}</span>
                      ) : (
                        <span className="text-rose-400">{tx.amount}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-neutral-400">
                    No transactions found in your ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyHistory;
