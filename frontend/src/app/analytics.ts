'use server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

function buildUrl(endpoint: string, params: { period?: string; startDate?: string; endDate?: string }) {
  const url = new URL(`${BACKEND_URL}/analytics/${endpoint}`);
  if (params.startDate && params.endDate) {
    url.searchParams.append('startDate', params.startDate);
    url.searchParams.append('endDate', params.endDate);
  } else if (params.period) {
    url.searchParams.append('period', params.period);
  }
  return url.toString();
}

export async function getFinancialMetrics(period?: string, startDate?: string, endDate?: string) {
  const url = buildUrl('metrics', { period, startDate, endDate });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function getRevenueChartData(period?: string, startDate?: string, endDate?: string) {
  const url = buildUrl('revenue-trend', { period, startDate, endDate });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch revenue trend data');
  return res.json();
}

export async function getLowStockItems() {
  const res = await fetch(`${BACKEND_URL}/analytics/low-stock`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch low stock items');
  return res.json();
}

export async function getTrendingItems(period?: string, startDate?: string, endDate?: string) {
  const url = buildUrl('trending', { period, startDate, endDate });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch trending items');
  return res.json();
}

export async function getPeakHoursData(period?: string, startDate?: string, endDate?: string) {
  const url = buildUrl('peak-hours', { period, startDate, endDate });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch peak hours data');
  return res.json();
}

export async function getCategorySplitData(period?: string, startDate?: string, endDate?: string) {
  const url = buildUrl('category-performance', { period, startDate, endDate });
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch category performance');
  return res.json();
}

export async function getStockRunRateData() {
  return [];
}

export async function getDeadStockData() {
  return [];
}
