import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, AlertTriangle, Check } from 'lucide-react';

interface AgeVerificationProps {
  onVerify: (birthDate: string) => void;
  onCancel: () => void;
  requiredAge: number;
  contentTitle: string;
}

export default function AgeVerification({
  onVerify,
  onCancel,
  requiredAge,
  contentTitle,
}: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < requiredAge) {
      setError(`You must be at least ${requiredAge} years old to access this content`);
      return;
    }

    onVerify(birthDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-br from-red-500/10 to-orange-500/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Age Verification Required</h2>
              <p className="text-sm text-gray-400">This content is restricted</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-300">
              <p className="font-semibold mb-1">Content Warning</p>
              <p>
                "{contentTitle}" contains material suitable only for audiences {requiredAge}+ years of age.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setError('');
                }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            <p>
              By entering your birth date, you confirm that you meet the age requirement for this content.
              This information is stored locally and never shared.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Verify Age
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
