import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { DownloadSession } from '../../../../core/domain/download-session.model';
import { HttpDownloadProfileAdapter } from '../../../secondary/api/download-profile-api.adapter';
import {
  clearDownloadSession,
  getUsableDownloadSession,
} from '../../../secondary/storage/download-session.store';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import { DownloadProfileDialog } from './DownloadProfileDialog';

type SessionRunner = (token: string) => Promise<void>;

export interface UseGatedPublicDownloadResult {
  runWithDownloadSession: (run: SessionRunner) => Promise<void>;
  downloadProfileDialog: ReactNode;
}

/**
 * Shared download gate: open the profile form when no usable session exists,
 * then auto-continue the original export with the issued token.
 */
export function useGatedPublicDownload(
  profileApi?: IDownloadProfileApiPort
): UseGatedPublicDownloadResult {
  const adapter = useMemo(
    () => profileApi ?? new HttpDownloadProfileAdapter(),
    [profileApi]
  );
  const pendingRunRef = useRef<SessionRunner | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const runWithDownloadSession = useCallback(async (run: SessionRunner) => {
    const session = getUsableDownloadSession();
    if (session) {
      await run(session.token);
      return;
    }
    pendingRunRef.current = run;
    setDialogOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    pendingRunRef.current = null;
    setDialogOpen(false);
  }, []);

  const handleSuccess = useCallback(async (session: DownloadSession) => {
    const pending = pendingRunRef.current;
    pendingRunRef.current = null;
    setDialogOpen(false);
    if (pending) {
      await pending(session.token);
    }
  }, []);

  const downloadProfileDialog = (
    <DownloadProfileDialog
      open={dialogOpen}
      onCancel={handleCancel}
      onSuccess={(session) => {
        void handleSuccess(session);
      }}
      api={adapter}
    />
  );

  return { runWithDownloadSession, downloadProfileDialog };
}

export function clearRejectedDownloadSession(): void {
  clearDownloadSession();
}
