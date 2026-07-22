/** Stub port — full implementation in Epic 5 dashboard issues 002–004. */
export interface DashboardAggregatesStub {
  totalSubmissions: number;
}

export interface IDashboardApiPort {
  fetchAggregates(): Promise<DashboardAggregatesStub>;
}
