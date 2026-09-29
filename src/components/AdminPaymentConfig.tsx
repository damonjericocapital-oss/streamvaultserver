import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Bitcoin, Settings, Save, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentGatewayConfig } from '../types/payment';

interface AdminPaymentConfigProps {
  config: PaymentGatewayConfig;
  onConfigChange: (config: PaymentGatewayConfig) => void;
  onClose: () => void;
}

export default function AdminPaymentConfig({ config, onConfigChange, onClose }: AdminPaymentConfigProps) {
  const [activeTab, setActiveTab] = useState<'stripe' | 'paypal' | 'crypto' | 'webhooks'>('stripe');
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSaveStripe = () => {
    if (!config.stripe?.publishableKey || !config.stripe?.secretKey) {
      setTestResult('error');
      return;
    }
    setTestResult('success');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleSavePayPal = () => {
    if (!config.paypal?.clientId || !config.paypal?.secret) {
      setTestResult('error');
      return;
    }
    setTestResult('success');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleSaveCrypto = () => {
    if (!config.crypto?.bitcoin && !config.crypto?.ethereum) {
      setTestResult('error');
      return;
    }
    setTestResult('success');
    setTimeout(() => setTestResult(null), 3000);
  };

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
        className="w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Payment Gateway Configuration</h2>
              <p className="text-sm text-gray-400">Configure your payment processors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Test Mode Toggle */}
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-white">Test Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.testMode}
                onChange={(e) => onConfigChange({ ...config, testMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {config.testMode ? '🧪 Test mode enabled - No real charges will be made' : '⚠️ Live mode - Real payments will be processed'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'stripe', label: 'Stripe', icon: CreditCard },
            { id: 'paypal', label: 'PayPal', icon: DollarSign },
            { id: 'crypto', label: 'Crypto', icon: Bitcoin },
            { id: 'webhooks', label: 'Webhooks', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'stripe' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Stripe Configuration</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.stripe?.enabled || false}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        stripe: { ...config.stripe!, enabled: e.target.checked },
                        activeGateway: e.target.checked ? 'stripe' : config.activeGateway,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={config.stripe?.publishableKey || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      stripe: { ...config.stripe!, publishableKey: e.target.value },
                    })
                  }
                  placeholder="pk_live_..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-gray-500 mt-1">Starts with pk_live_ or pk_test_</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={config.stripe?.secretKey || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      stripe: { ...config.stripe!, secretKey: e.target.value },
                    })
                  }
                  placeholder="sk_live_..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-gray-500 mt-1">Starts with sk_live_ or sk_test_</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={config.stripe?.webhookSecret || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      stripe: { ...config.stripe!, webhookSecret: e.target.value },
                    })
                  }
                  placeholder="whsec_..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-xs text-gray-500 mt-1">Found in Stripe Dashboard → Webhooks</p>
              </div>

              <button
                onClick={handleSaveStripe}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Stripe Configuration
              </button>
            </div>
          )}

          {activeTab === 'paypal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">PayPal Configuration</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.paypal?.enabled || false}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        paypal: { ...config.paypal!, enabled: e.target.checked },
                        activeGateway: e.target.checked ? 'paypal' : config.activeGateway,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={config.paypal?.clientId || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      paypal: { ...config.paypal!, clientId: e.target.value },
                    })
                  }
                  placeholder="AaBbCcDd..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secret
                </label>
                <input
                  type="password"
                  value={config.paypal?.secret || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      paypal: { ...config.paypal!, secret: e.target.value },
                    })
                  }
                  placeholder="EeFfGgHh..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  value={config.paypal?.businessEmail || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      paypal: { ...config.paypal!, businessEmail: e.target.value },
                    })
                  }
                  placeholder="your@business.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="paypal-sandbox"
                  checked={config.paypal?.sandbox || false}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      paypal: { ...config.paypal!, sandbox: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="paypal-sandbox" className="text-sm text-gray-300">
                  Use Sandbox (Test Mode)
                </label>
              </div>

              <button
                onClick={handleSavePayPal}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save PayPal Configuration
              </button>
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Cryptocurrency Configuration</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.crypto?.enabled || false}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        crypto: { ...config.crypto!, enabled: e.target.checked },
                        activeGateway: e.target.checked ? 'crypto' : config.activeGateway,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bitcoin Wallet Address
                </label>
                <input
                  type="text"
                  value={config.crypto?.bitcoin || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      crypto: { ...config.crypto!, bitcoin: e.target.value },
                    })
                  }
                  placeholder="bc1q..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ethereum Wallet Address
                </label>
                <input
                  type="text"
                  value={config.crypto?.ethereum || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      crypto: { ...config.crypto!, ethereum: e.target.value },
                    })
                  }
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  USDT Wallet Address (ERC-20)
                </label>
                <input
                  type="text"
                  value={config.crypto?.usdt || ''}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      crypto: { ...config.crypto!, usdt: e.target.value },
                    })
                  }
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <button
                onClick={handleSaveCrypto}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Crypto Configuration
              </button>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Webhook Configuration</h3>
                <p className="text-sm text-gray-400">
                  Configure webhook endpoints to receive payment notifications
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Webhook URLs Required</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You must configure webhook URLs in your payment gateway dashboard:
                    </p>
                    <ul className="text-xs text-gray-400 mt-2 space-y-1">
                      <li>• Stripe: Dashboard → Developers → Webhooks</li>
                      <li>• PayPal: Dashboard → Webhooks → Add webhook</li>
                      <li>• Crypto: Coinbase Commerce → Settings → Webhooks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Supported Events</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'payment_intent.succeeded',
                    'payment_intent.failed',
                    'customer.subscription.created',
                    'customer.subscription.updated',
                    'customer.subscription.deleted',
                    'invoice.paid',
                    'invoice.payment_failed',
                    'charge.refunded',
                  ].map((event) => (
                    <div
                      key={event}
                      className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-gray-300">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-800/30">
          {testResult === 'success' && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400">Configuration saved successfully!</span>
            </div>
          )}
          {testResult === 'error' && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400">Please fill in all required fields</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Active Gateway: <span className="text-emerald-400 font-medium">{config.activeGateway}</span>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
