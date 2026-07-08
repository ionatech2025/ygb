import React, { useState, useEffect } from 'react';
import { MockUserAdapter } from '../../../secondary/api/mock-user.adapter';
import { type User, parseAndValidateUgandaPhone } from '../../../../core/domain/user.model';
import { PlusCircle, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

// Instantiate our driven adapter repository port implementation
const userRepo = new MockUserAdapter();

export default function ManageUsers() {
  // Component State
  const [users, setUsers] = useState<User[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation and Feedback States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Context Actor: Enforces the invariant that an Admin must be the creator
  const CURRENT_ADMIN_ID = "admin-2026-mvp"; 

  // Load registered data collectors
  const loadCollectors = async () => {
    try {
      const collectors = await userRepo.getUsersByRole('DATA_COLLECTOR');
      setUsers(collectors);
    } catch (err) {
      setServerError('Failed to fetch user directory.');
    }
  };

  useEffect(() => {
    loadCollectors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous feedback cycles
    setErrors({});
    setServerError('');
    setSuccessMessage('');
    
    const localValidationErrors: { [key: string]: string } = {};

    // TC-AUTH-01-03: Validate required text presence
    if (!fullName.trim()) {
      localValidationErrors.fullName = 'Full Name is required';
    }
    if (!password.trim()) {
      localValidationErrors.password = 'Password is required';
    }

    // Invariant Rule Check: Parse and validate using the erasable-compliant function
    let validatedPhone = '';
    if (!phoneInput.trim()) {
      localValidationErrors.phoneInput = 'Phone Number is required';
    } else {
      try {
        validatedPhone = parseAndValidateUgandaPhone(phoneInput);
      } catch (parseError: any) {
        localValidationErrors.phoneInput = parseError.message;
      }
    }

    // Block processing if any local validation checks failed
    if (Object.keys(localValidationErrors).length > 0) {
      setErrors(localValidationErrors);
      return;
    }

    try {
      // Direct call through the decoupled out-port implementation strategy
      await userRepo.createDataCollector({ 
        fullName: fullName.trim(), 
        phoneNumber: validatedPhone
      }, CURRENT_ADMIN_ID);
      
      // TC-AUTH-01-01: Explicit Success Feedback & View Updates
      setSuccessMessage(`Account for "${fullName}" created successfully!`);
      setFullName('');
      setPhoneInput('');
      setPassword('');
      
      // Refresh matching view components
      await loadCollectors();
    } catch (err: any) {
      // TC-AUTH-01-02: Catch domain exception layers (e.g. Duplicates)
      setServerError(err.message || 'An error occurred during account creation.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Creation Form Panel (Driving Side Interface) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          Add Data Collector
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                errors.fullName ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-300 focus:ring-indigo-100'
              }`}
              placeholder="Jane Nakato"
            />
            {errors.fullName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                errors.phoneInput ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-300 focus:ring-indigo-100'
              }`}
              placeholder="e.g. 0772123456"
            />
            {errors.phoneInput && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phoneInput}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                errors.password ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-300 focus:ring-indigo-100'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm"
          >
            Save Account
          </button>
        </form>
      </div>

      {/* Collector List Directory Panel (Observing State Outcome) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-600" />
          Active Data Collectors
        </h2>

        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="p-3">Full Name</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-medium text-slate-900">{u.fullName}</td>
                  <td className="p-3 text-slate-500 font-mono tracking-tight">{u.phoneNumber}</td>
                  <td className="p-3 text-xs font-mono text-slate-400">{u.createdByAdminId}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                    No active field collectors located. Use the form tool to provision accounts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}