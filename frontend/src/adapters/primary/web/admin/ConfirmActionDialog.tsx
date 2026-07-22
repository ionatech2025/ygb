import { AlertTriangle } from 'lucide-react';

export interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmActionDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl"
        data-testid="confirm-action-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`rounded-full p-2 ${destructive ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}
          >
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="confirm-action-title" className="text-base font-bold text-text">
              {title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text disabled:opacity-50"
            data-testid="confirm-action-cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
              destructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-nac-blue hover:bg-nac-blue-dark'
            }`}
            data-testid="confirm-action-confirm"
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
