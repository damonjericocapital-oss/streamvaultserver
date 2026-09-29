import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Zap, Star, Building2 } from 'lucide-react';
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from '../types/compliance';

interface SubscriptionManagerProps {
  currentPlan: string;
  onPlanChange: (planId: string) => void;
  onClose: () => void;
}

export default function SubscriptionManager({ currentPlan, onPlanChange, onClose }: SubscriptionManagerProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const getPlanIcon = (priority: string) => {
    switch (priority) {
      case 'free':
        return <Star className="w-6 h-6 text-gray-400" />;
      case 'basic':
        return <Star className="w-6 h-6 text-gray-400" />;
      case 'standard':
        return <Zap className="w-6 h-6 text-blue-400" />;
      case 'premium':
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 'enterprise':
        return <Building2 className="w-6 h-6 text-purple-400" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (priority: string) => {
    switch (priority) {
      case 'free':
        return 'from-gray-600 to-gray-700';
      case 'basic':
        return 'from-gray-600 to-gray-700';
      case 'standard':
        return 'from-blue-500 to-blue-600';
      case 'premium':
        return 'from-amber-500 to-amber-600';
      case 'enterprise':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      onPlanChange(selectedPlan.id);
      setShowPayment(false);
      setSelectedPlan(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-sm text-gray-400 mt-1">Unlock the full power of StreamVault</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingInterval === 'month'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingInterval === 'year'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500/5'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    CURRENT
                  </div>
                )}

                {/* Plan Header */}
                <div className={`p-6 bg-gradient-to-br ${getPlanColor(plan.priority)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {getPlanIcon(plan.priority)}
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-sm text-white/70">
                      /{billingInterval === 'year' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-700 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Devices</span>
                      <span className="text-white font-medium">{plan.maxDevices}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Quality</span>
                      <span className="text-white font-medium">{plan.maxQuality.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-white font-medium">
                        {plan.storageLimit >= 1000
                          ? `${plan.storageLimit / 1000} TB`
                          : `${plan.storageLimit} GB`}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !isCurrent && handleSelectPlan(plan)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                      isCurrent
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : plan.priority === 'free'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : `bg-gradient-to-r ${getPlanColor(plan.priority)} text-white hover:opacity-90`
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayment && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setShowPayment(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Upgrade to {selectedPlan.name}
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Plan</span>
                      <span className="text-white font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Billing</span>
                      <span className="text-white font-medium capitalize">{billingInterval}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <span className="text-gray-400">Total</span>
                      <span className="text-2xl font-bold text-amber-400">
                        $
                        {(
                          billingInterval === 'year'
                            ? selectedPlan.price * 12 * 0.8
                            : selectedPlan.price
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Payment Method</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
                      <option>Credit Card</option>
                      <option>PayPal</option>
                      <option>Crypto</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="flex-1 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
