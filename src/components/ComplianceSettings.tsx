import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Eye, Lock, Users, Baby, Ban, CheckCircle } from 'lucide-react';
import { RTAConfig, ContentModerationConfig, ChildProtectionConfig } from '../types/compliance';

interface ComplianceSettingsProps {
  rtaConfig: RTAConfig;
  moderationConfig: ContentModerationConfig;
  childProtectionConfig: ChildProtectionConfig;
  onRTAChange: (config: RTAConfig) => void;
  onModerationChange: (config: ContentModerationConfig) => void;
  onChildProtectionChange: (config: ChildProtectionConfig) => void;
  onClose: () => void;
}

export default function ComplianceSettings({
  rtaConfig,
  moderationConfig,
  childProtectionConfig,
  onRTAChange,
  onModerationChange,
  onChildProtectionChange,
  onClose,
}: ComplianceSettingsProps) {
  const [activeTab, setActiveTab] = useState<'rta' | 'moderation' | 'child'>('rta');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[600px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-red-500/5 to-orange-500/5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Safety & Compliance</h3>
            <p className="text-xs text-gray-500">RTA, Content Moderation & Child Protection</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('rta')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'rta'
              ? 'text-red-400 border-b-2 border-red-400 bg-red-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          RTA Policy
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'moderation'
              ? 'text-red-400 border-b-2 border-red-400 bg-red-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Moderation
        </button>
        <button
          onClick={() => setActiveTab('child')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'child'
              ? 'text-red-400 border-b-2 border-red-400 bg-red-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          Child Protection
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'rta' && (
          <div className="p-4 space-y-4">
            {/* Enable RTA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable RTA Labeling</p>
                <p className="text-xs text-gray-500">Restricted to Adults (18+)</p>
              </div>
              <button
                onClick={() => onRTAChange({ ...rtaConfig, enabled: !rtaConfig.enabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  rtaConfig.enabled ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: rtaConfig.enabled ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {rtaConfig.enabled && (
              <>
                {/* Rating System */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Rating System</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'mpaa', label: 'MPAA' },
                      { value: 'pegi', label: 'PEGI' },
                      { value: 'custom', label: 'Custom' },
                    ].map((system) => (
                      <button
                        key={system.value}
                        onClick={() =>
                          onRTAChange({ ...rtaConfig, ratingSystem: system.value as any })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          rtaConfig.ratingSystem === system.value
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {system.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Require Age Verification</p>
                    <p className="text-xs text-gray-500">Users must verify age before access</p>
                  </div>
                  <button
                    onClick={() =>
                      onRTAChange({ ...rtaConfig, requireVerification: !rtaConfig.requireVerification })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      rtaConfig.requireVerification ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: rtaConfig.requireVerification ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Block Underage */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Block Underage Access</p>
                    <p className="text-xs text-gray-500">Prevent users under 18 from viewing</p>
                  </div>
                  <button
                    onClick={() =>
                      onRTAChange({ ...rtaConfig, blockUnderage: !rtaConfig.blockUnderage })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      rtaConfig.blockUnderage ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: rtaConfig.blockUnderage ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Adult Content Warning */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Show Content Warnings</p>
                    <p className="text-xs text-gray-500">Display warnings before adult content</p>
                  </div>
                  <button
                    onClick={() =>
                      onRTAChange({
                        ...rtaConfig,
                        adultContentWarning: !rtaConfig.adultContentWarning,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      rtaConfig.adultContentWarning ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: rtaConfig.adultContentWarning ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </>
            )}

            {/* Info */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-semibold mb-1">Legal Compliance</p>
                  <p className="text-gray-400">
                    RTA labeling is required by law in many jurisdictions. Ensure all adult content
                    is properly labeled and access is restricted to verified adults only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="p-4 space-y-4">
            {/* Enable Moderation */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Content Moderation</p>
                <p className="text-xs text-gray-500">AI-powered content analysis</p>
              </div>
              <button
                onClick={() =>
                  onModerationChange({ ...moderationConfig, enabled: !moderationConfig.enabled })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  moderationConfig.enabled ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: moderationConfig.enabled ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {moderationConfig.enabled && (
              <>
                {/* AI Detection */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">AI Detection</p>
                    <p className="text-xs text-gray-500">Automated content analysis</p>
                  </div>
                  <button
                    onClick={() =>
                      onModerationChange({
                        ...moderationConfig,
                        aiDetection: !moderationConfig.aiDetection,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      moderationConfig.aiDetection ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: moderationConfig.aiDetection ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Illegal Content Block */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-400" />
                      Block Illegal Content
                    </p>
                    <p className="text-xs text-gray-500">Automatic detection and blocking</p>
                  </div>
                  <button
                    onClick={() =>
                      onModerationChange({
                        ...moderationConfig,
                        illegalContentBlock: !moderationConfig.illegalContentBlock,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      moderationConfig.illegalContentBlock ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: moderationConfig.illegalContentBlock ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* CSAM Detection */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      CSAM Detection
                    </p>
                    <p className="text-xs text-gray-500">
                      Child Sexual Abuse Material detection
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onModerationChange({
                        ...moderationConfig,
                        csamDetection: !moderationConfig.csamDetection,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      moderationConfig.csamDetection ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: moderationConfig.csamDetection ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Violence Detection */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Violence Detection</p>
                    <p className="text-xs text-gray-500">Detect violent content</p>
                  </div>
                  <button
                    onClick={() =>
                      onModerationChange({
                        ...moderationConfig,
                        violenceDetection: !moderationConfig.violenceDetection,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      moderationConfig.violenceDetection ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: moderationConfig.violenceDetection ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Confidence Threshold */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Confidence Threshold: {moderationConfig.confidenceThreshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={moderationConfig.confidenceThreshold}
                    onChange={(e) =>
                      onModerationChange({
                        ...moderationConfig,
                        confidenceThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher = fewer false positives, Lower = catch more content
                  </p>
                </div>

                {/* Auto Quarantine */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Quarantine</p>
                    <p className="text-xs text-gray-500">Isolate flagged content automatically</p>
                  </div>
                  <button
                    onClick={() =>
                      onModerationChange({
                        ...moderationConfig,
                        autoQuarantine: !moderationConfig.autoQuarantine,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      moderationConfig.autoQuarantine ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: moderationConfig.autoQuarantine ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </>
            )}

            {/* Legal Notice */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-semibold mb-1">Zero Tolerance Policy</p>
                  <p className="text-gray-400">
                    StreamVault has zero tolerance for illegal content including CSAM. All detected
                    content is automatically blocked and reported to authorities as required by law.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'child' && (
          <div className="p-4 space-y-4">
            {/* Enable Child Protection */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Child Protection</p>
                <p className="text-xs text-gray-500">Comprehensive safety features</p>
              </div>
              <button
                onClick={() =>
                  onChildProtectionChange({
                    ...childProtectionConfig,
                    enabled: !childProtectionConfig.enabled,
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  childProtectionConfig.enabled ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: childProtectionConfig.enabled ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {childProtectionConfig.enabled && (
              <>
                {/* Parental Controls */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Parental Controls</p>
                    <p className="text-xs text-gray-500">Enable parental oversight</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        parentalControls: !childProtectionConfig.parentalControls,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.parentalControls ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.parentalControls ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Kid Profiles */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Kid Profiles</p>
                    <p className="text-xs text-gray-500">Create child-safe profiles</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        kidProfiles: !childProtectionConfig.kidProfiles,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.kidProfiles ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.kidProfiles ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Content Filtering */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Content Filtering</p>
                    <p className="text-xs text-gray-500">Filter inappropriate content</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        contentFiltering: !childProtectionConfig.contentFiltering,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.contentFiltering ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.contentFiltering ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Time Limits */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Time Limits</p>
                    <p className="text-xs text-gray-500">Set daily usage limits</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        timeLimits: !childProtectionConfig.timeLimits,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.timeLimits ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.timeLimits ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Block Chat */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Block Chat Features</p>
                    <p className="text-xs text-gray-500">Disable chat for child profiles</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        blockChat: !childProtectionConfig.blockChat,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.blockChat ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.blockChat ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Block Purchases */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Block Purchases</p>
                    <p className="text-xs text-gray-500">Prevent accidental purchases</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        blockPurchases: !childProtectionConfig.blockPurchases,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.blockPurchases ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.blockPurchases ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Require PIN */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Require PIN for Changes</p>
                    <p className="text-xs text-gray-500">PIN required to modify settings</p>
                  </div>
                  <button
                    onClick={() =>
                      onChildProtectionChange({
                        ...childProtectionConfig,
                        requirePin: !childProtectionConfig.requirePin,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      childProtectionConfig.requirePin ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: childProtectionConfig.requirePin ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </>
            )}

            {/* Info */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-300">
                  <p className="font-semibold mb-1">COPPA Compliant</p>
                  <p className="text-gray-400">
                    Child protection features comply with COPPA (Children's Online Privacy
                    Protection Act) and other international child safety regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
