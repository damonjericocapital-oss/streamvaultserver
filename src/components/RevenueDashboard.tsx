import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Activity, Calendar, CreditCard } from 'lucide-react';
import { RevenueStats, Transaction } from '../types/payment';

interface RevenueDashboardProps {
  stats: RevenueStats;
  transactions: Transaction[];
  onClose: () => void;
}

export default function RevenueDashboard({ stats, transactions, onClose }: RevenueDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Dashboard</h2>
              <p className="text-sm text-gray-400">Monitor your subscription revenue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-emerald-400" />
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-400" />
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                ${stats.monthlyRecurringRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">Monthly Recurring Revenue</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-400" />
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.activeSubscribers}</p>
              <p className="text-sm text-gray-400 mt-1">Active Subscribers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-8 h-8 text-amber-400" />
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                ${stats.averageRevenuePerUser.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg Revenue Per User</p>
            </motion.div>
          </div>

          {/* Revenue by Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Revenue by Plan</h3>
            <div className="space-y-3">
              {Object.entries(stats.revenueByPlan).map(([plan, revenue]) => (
                <div key={plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-gray-300 capitalize">{plan}</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-emerald-400'
                          : transaction.status === 'pending'
                          ? 'bg-amber-400'
                          : transaction.status === 'failed'
                          ? 'bg-red-400'
                          : 'bg-gray-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-white">{transaction.userEmail}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {transaction.planId} • {transaction.gateway}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
