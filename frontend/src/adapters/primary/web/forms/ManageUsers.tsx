import React, { useState, useEffect } from 'react';
import { MockUserAdapter } from '../../../secondary/api/mock-user.adapter';
import { PlusCircle, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

function parseAndValidateUgandaPhone(input: string): string {
  const raw = (input || '').toString().trim();
  if (!raw) throw new Error('Phone number is required');

  const cleaned = raw.replace(/[^+\d]/g, '');
  let digits = cleaned;
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }
  if (/^0\d{9}$/.test(digits)) {
    digits = '256' + digits.slice(1);
  }
  if (/^7\d{8}$/.test(digits)) {
    digits = '256' + digits;
  }
  if (!/^2567\d{8}$/.test(digits)) {
    throw new Error('Invalid Uganda phone number format');
  }
  return '+' + digits;
}

type User = {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  createdAt: number;
};

const userRepo = new MockUserAdapter();

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const CURRENT_ADMIN_ID = "admin-2026-mvp"; 

  const loadCollectors = async () => {
    try {
      const collectors = await userRepo.fetchActiveCollectors();
      setUsers(collectors as User[]);
    } catch (err) {
      setServerError('Failed to fetch user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollectors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setSuccessMessage('');
    
    const localValidationErrors: { [key: string]: string } = {};

    // TC-AUTH-01-03 Check: Validate presence of inputs
    if (!fullName.trim()) localValidationErrors.fullName = 'Full Name is required';
    if (!password.trim()) localValidationErrors.password = 'Password is required';

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

    if (Object.keys(localValidationErrors).length > 0) {
      setErrors(localValidationErrors);
      return;
    }

    try {
      // Create collector through port boundary
      await userRepo.createDataCollector({ 
        fullName: fullName.trim(), 
        phoneNumber: validatedPhone
      }, CURRENT_ADMIN_ID);
      
      // TC-AUTH-01-01 Feedback Loop
      setSuccessMessage(`Account for "${fullName}" created successfully!`);
      setFullName('');
      setPhoneInput('');
      setPassword('');
      
      await loadCollectors();
    } catch (err: any) {
      // TC-AUTH-01-02 Duplicate Trap
      setServerError(err.message || 'An error occurred during account creation.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Creation Side Form Panel - US-AUTH-01 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          Add Data Collector
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
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
              Initial Password <span className="text-red-500">*</span>
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

      {/* Directory Monitoring List Side */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-600" />
          Active Data Collectors Dashboard
        </h2>

        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="p-3">Full Name</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Designation Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                    Loading directory info...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900">{u.fullName}</td>
                    <td className="p-3 text-slate-500 font-mono tracking-tight">{u.phoneNumber}</td>
                    <td className="p-3 text-xs font-semibold text-slate-400">{u.role}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}