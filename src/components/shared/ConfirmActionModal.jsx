import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Trash2, X } from 'lucide-react';

const CONFIRM_PHRASES = {
  deactivate: 'deactivate',
  delete: 'delete account',
};

/**
 * Requires the user to type a confirmation phrase before a destructive action proceeds.
 *
 * Props:
 *   type        – 'deactivate' | 'delete'
 *   onConfirm   – called when phrase matches and user clicks confirm
 *   onClose     – called to dismiss the modal
 */
const ConfirmActionModal = ({ type, onConfirm, onClose }) => {
  const [input, setInput] = useState('');

  const isDelete = type === 'delete';
  const phrase   = CONFIRM_PHRASES[type];
  const matched  = input.trim().toLowerCase() === phrase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDelete ? 'bg-red-100' : 'bg-yellow-100'}`}>
              {isDelete
                ? <Trash2 className="w-5 h-5 text-red-600" />
                : <AlertCircle className="w-5 h-5 text-yellow-600" />}
            </div>
            <h3 className={`text-lg font-bold ${isDelete ? 'text-red-900' : 'text-gray-900'}`}>
              {isDelete ? 'Delete Account' : 'Deactivate Account'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {isDelete
            ? 'This will permanently remove your account and all associated data. This action cannot be undone.'
            : 'Your account will be temporarily deactivated. You can reactivate it within 30 days by logging in again.'}
        </p>

        {/* Phrase prompt */}
        <div className={`rounded-lg p-3 mb-5 text-sm ${isDelete ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}`}>
          To confirm, type <span className="font-bold">"{phrase}"</span> below.
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type "${phrase}" to confirm`}
          className={`w-full px-4 py-3 border-2 rounded-lg text-sm outline-none transition-colors mb-5 ${
            input && !matched
              ? 'border-red-300 focus:border-red-500'
              : matched
              ? 'border-green-400 focus:border-green-500'
              : 'border-gray-300 focus:border-primary'
          }`}
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!matched}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              matched
                ? isDelete
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isDelete ? 'Delete Account' : 'Deactivate Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export { ConfirmActionModal };
