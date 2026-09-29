import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, CreditCard, Lock, Check } from 'lucide-react';
import { PaidContentConfig } from '../types/ecosystem';

interface PaidViewingProps {
  config: PaidContentConfig;
  onConfigChange: (config: PaidContentConfig) => void;
  onClose: () => void;
}

export default function PaidViewing({ config, onConfigChange, onClose }: PaidViewingProps) {
  const handleAddTier = () => {
    const newTier = {
      id: Date.now().toString(),
      name: 'New Tier',
      price: 4.99,
      quality: '1080p',
      description: 'Standard quality access',
    };
    onConfigChange({
      ...config,
      priceTiers: [...config.priceTiers, newTier],
    });
  };

  const handleUpdateTier = (id: string, updates: Partial<typeof config.priceTiers[0]>) => {
    onConfigChange({
      ...config,
      priceTiers: config.priceTiers.map((tier) =>
        tier.id === id ? { ...tier, ...updates } : tier
      ),
    });
  };

  const handleRemoveTier = (id: string) => {
    onConfigChange({
      ...config,
      priceTiers: config.priceTiers.filter((tier) => tier.id !== id),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Paid Viewing</h3>
            <p className="text-xs text-gray-500">Monetize premium content</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Enable Paid Content */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-white">Enable Paid Content</p>
            <p className="text-xs text-gray-500">Allow pay-per-view and rentals</p>
          </div>
          <button
            onClick={() => onConfigChange({ ...config, enabled: !config.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.enabled ? 'bg-amber-500' : 'bg-gray-600'
            }`}
          >
            <motion.div
              animate={{ x: config.enabled ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {config.enabled && (
          <>
            {/* Currency */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Currency</label>
              <select
                value={config.currency}
                onChange={(e) => onConfigChange({ ...config, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-amber-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="IDR">IDR (Rp)</option>
              </select>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Payment Methods</label>
              <div className="grid grid-cols-2 gap-2">
                {['Credit Card', 'PayPal', 'Crypto', 'Bank Transfer'].map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      const methods = config.paymentMethods.includes(method)
                        ? config.paymentMethods.filter((m) => m !== method)
                        : [...config.paymentMethods, method];
                      onConfigChange({ ...config, paymentMethods: methods });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      config.paymentMethods.includes(method)
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tiers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price Tiers
                </h4>
                <button
                  onClick={handleAddTier}
                  className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                >
                  + Add Tier
                </button>
              </div>

              <div className="space-y-2">
                {config.priceTiers.map((tier) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-xs text-gray-500">Name</label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleUpdateTier(tier.id, { name: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Price</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) =>
                            handleUpdateTier(tier.id, { price: Number(e.target.value) })
                          }
                          step="0.01"
                          className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Quality</label>
                        <select
                          value={tier.quality}
                          onChange={(e) =>
                            handleUpdateTier(tier.id, { quality: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-500"
                        >
                          <option value="4k">4K</option>
                          <option value="1080p">1080p</option>
                          <option value="720p">720p</option>
                          <option value="480p">480p</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => handleRemoveTier(tier.id)}
                          className="w-full px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rental Period */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Rental Period: {config.rentalPeriod} hours
              </label>
              <input
                type="range"
                min="24"
                max="720"
                step="24"
                value={config.rentalPeriod}
                onChange={(e) =>
                  onConfigChange({ ...config, rentalPeriod: Number(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>24 hours</span>
                <span>30 days</span>
              </div>
            </div>

            {/* Purchase Option */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-white">Permanent Purchase</p>
                <p className="text-xs text-gray-500">Allow users to buy content permanently</p>
              </div>
              <button
                onClick={() =>
                  onConfigChange({
                    ...config,
                    purchasePermanent: !config.purchasePermanent,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  config.purchasePermanent ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: config.purchasePermanent ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
