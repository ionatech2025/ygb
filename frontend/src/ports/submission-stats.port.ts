export interface ISubmissionStatsPort {
  countTodayLocal(): Promise<number>;
  fetchServerDailyCount(accessToken: string): Promise<number>;
}
