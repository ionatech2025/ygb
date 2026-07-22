export class DuplicateRespondentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateRespondentError';
  }
}

export function isDuplicateRespondentMessage(message: string): boolean {
  return message.includes('form already submitted for this respondent');
}
