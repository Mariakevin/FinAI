
import { Transaction, formatDate } from './finance';

/**
 * Exports transactions to a CSV file and triggers download
 * @param transactions Array of transactions to export
 */
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  // Define CSV header row
  const headers = [
    'Date',
    'Description',
    'Category',
    'Amount',
    'Type',
  ];
  
  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    formatDate(transaction.date),
    `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes in description
    transaction.category,
    transaction.amount.toString(),
    transaction.type,
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
