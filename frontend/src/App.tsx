import ManageUsers from './adapters/primary/web/forms/ManageUsers';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">YGB Survey Tool Admin Panel</h1>
          <span className="text-xs text-slate-500 font-medium">Sprint 1 / Phase 1 MVP</span>
        </div>
      </header>
      <main className="py-6">
        <ManageUsers />
      </main>
    </div>
  );
}