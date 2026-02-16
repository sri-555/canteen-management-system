import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
} from 'lucide-react';

export function Wallet() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const txData = await api.student.getWalletTransactions();
      setTransactions(txData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      await api.student.addWalletBalance(amount);
      await refreshUser();
      await fetchData();
      setIsTopUpOpen(false);
      setTopUpAmount('');
    } catch (err: any) {
      alert('Failed to add balance: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Digital Wallet</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-indigo-100 font-medium mb-1">
                  Current Balance
                </p>
                <h2 className="text-4xl font-bold">
                  ₹{parseFloat(user?.wallet_balance || '0').toFixed(2)}
                </h2>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsTopUpOpen(true)}
                variant="secondary"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Top Up
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="flex flex-col justify-center items-center text-center p-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold text-indigo-600">{transactions.length}</p>
        </Card>
      </div>

      {/* Transaction History */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction History
        </h2>
        <Card noPadding>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${tx.transaction_type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                      `}
                    >
                      {tx.transaction_type === 'credit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}
                    >
                      {tx.transaction_type === 'credit' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500">
                      Balance: ₹{parseFloat(tx.balance_after).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Top Up Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        title="Add Money to Wallet"
      >
        <form onSubmit={handleTopUp} className="space-y-4">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="1"
            required
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <div className="flex gap-2">
            {[100, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTopUpAmount(amount.toString())}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsTopUpOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add Money
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
