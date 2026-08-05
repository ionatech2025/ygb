export const DOWNLOAD_SESSION_HEADER = 'X-Download-Session';

export function buildDownloadSessionHeaders(token: string): HeadersInit {
  return { [DOWNLOAD_SESSION_HEADER]: token };
}

export const DOWNLOAD_SESSION_REJECTED_MESSAGE =
  'Your download session expired or is invalid. Complete the profile form and try again.';

export function isDownloadSessionRejectedStatus(status: number): boolean {
  return status === 401 || status === 403;
}
