
import { Transaction, formatDate } from './finance';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

export type ExportFormat = 'csv' | 'json' | 'pdf';

/**
 * Exports transactions to a file in the specified format and triggers download
 * @param transactions Array of transactions to export
 * @param format Format to export in (csv, json, pdf)
 */
export const exportTransactions = (transactions: Transaction[], format: ExportFormat = 'csv'): void => {
  try {
    const filename = `transactions_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'csv':
        exportToCSV(transactions, filename);
        break;
      case 'json':
        exportToJSON(transactions, filename);
        break;
      case 'pdf':
        // For PDF we just use a simple HTML-based approach since we don't want to add a heavy PDF library
        exportToHTML(transactions, filename);
        break;
    }
    
    toast.success(`Transactions exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export transactions');
  }
};

/**
 * Exports transactions to a CSV file and triggers download
 */
const exportToCSV = (transactions: Transaction[], filename: string): void => {
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
  
  // Use file-saver for better cross-browser compatibility
  saveAs(blob, `${filename}.csv`);
};

/**
 * Exports transactions to a JSON file and triggers download
 */
const exportToJSON = (transactions: Transaction[], filename: string): void => {
  // Prepare JSON data with formatted dates
  const jsonData = transactions.map(transaction => ({
    ...transaction,
    formattedDate: formatDate(transaction.date)
  }));
  
  // Create a Blob containing the JSON data
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8;' });
  
  // Use file-saver for better cross-browser compatibility
  saveAs(blob, `${filename}.json`);
};

/**
 * Exports transactions to an HTML file for printing as PDF
 */
const exportToHTML = (transactions: Transaction[], filename: string): void => {
  // Create HTML content for transactions
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FinWise Transactions</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f2f2f2; text-align: left; padding: 8px; }
        td { border-bottom: 1px solid #ddd; padding: 8px; }
        .income { color: green; }
        .expense { color: red; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>FinWise Transactions</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(transaction => `
            <tr>
              <td>${formatDate(transaction.date)}</td>
              <td>${transaction.description}</td>
              <td>${transaction.category}</td>
              <td class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}</td>
              <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>FinWise - Personal Finance Tracker</p>
      </div>
    </body>
    </html>
  `;
  
  // Create a Blob containing the HTML data
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  
  // Use file-saver for better cross-browser compatibility
  saveAs(blob, `${filename}.html`);
};

// Legacy export function for compatibility
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  exportTransactions(transactions, 'csv');
};
