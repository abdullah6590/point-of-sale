'use server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function getFinancialMetrics(period: string = 'this-month') {
  const res = await fetch(`${BACKEND_URL}/analytics/metrics?period=${period}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function getRevenueChartData() {
  const res = await fetch(`${BACKEND_URL}/analytics/revenue-trend`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch revenue trend data');
  return res.json();
}

export async function getLowStockItems() {
  const res = await fetch(`${BACKEND_URL}/analytics/low-stock`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch low stock items');
  return res.json();
}

export async function getTrendingItems() {
  const res = await fetch(`${BACKEND_URL}/analytics/trending`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch trending items');
  return res.json();
}

export async function getPeakHoursData() {
  const res = await fetch(`${BACKEND_URL}/analytics/peak-hours`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch peak hours data');
  return res.json();
}

export async function getCategorySplitData() {
  return []; 
}

export async function getStockRunRateData() {
  return [];
}

export async function getDeadStockData() {
  return [];
}
