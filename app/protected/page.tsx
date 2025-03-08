// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import html2canvas from 'html2canvas';
// import { createClient } from '@/utils/supabase/client';

// // Define types for data and error
// interface RecipeData {
//   [key: string]: any;
// }

// interface SupabaseDataExporterProps {
//   defaultTableName?: string;
// }

// export default function SupabaseDataExporter({ defaultTableName = "ingredients" }: SupabaseDataExporterProps) {
//   const [tableName, setTableName] = useState<string>(defaultTableName);
//   const [data, setData] = useState<RecipeData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const tableRef = useRef<HTMLDivElement | null>(null);
  
//   // State to track if we should fetch data (only after user submits)
//   const [tableToFetch, setTableToFetch] = useState<string>(defaultTableName);

//   // Fetch table data when tableToFetch changes
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!tableToFetch) return;
      
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Create supabase client inside the effect
//         const supabase = await createClient();

//         // Fetch all data from your table
//         const { data: tableData, error } = await supabase
//           .from(tableToFetch)
//           .select('*');

//         if (error) throw error;

//         setData(tableData as RecipeData[]);
//       } catch (err: any) {
//         setError(err.message);
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [tableToFetch]);

//   const handleFetchTable = (e: React.FormEvent) => {
//     e.preventDefault();
//     setTableToFetch(tableName);
//   };

//   const exportAsImage = async () => {
//     if (!tableRef.current) return;

//     try {
//       const canvas = await html2canvas(tableRef.current);
//       const image = canvas.toDataURL('image/png', 1.0);

//       // Create a download link
//       const downloadLink = document.createElement('a');
//       downloadLink.href = image;
//       downloadLink.download = `${tableToFetch}_export.png`;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//     } catch (err) {
//       console.error('Failed to export image:', err);
//     }
//   };

//   const exportAsLatex = () => {
//     if (data.length === 0) return;
    
//     const columns = Object.keys(data[0]);
    
//     // Create LaTeX table header
//     let latexContent = '\\begin{table}[h]\n\\centering\n\\begin{tabularx}{';
    
//     // Add column formatting (one "l" for each column - left-aligned)
//     latexContent += columns.map(() => 'X').join('|');
//     latexContent += '}\n\\hline\n';
    
//     // Add column headers
//     latexContent += columns.map(col => `\\textbf{${col}}`).join(' & ');
//     latexContent += ' \\\\ \\hline\n';
    
//     // Add data rows
//     data.forEach(row => {
//       latexContent += columns.map(col => {
//         const value = row[col];
//         if (value === null || value === undefined) return '';
//         if (typeof value === 'object') return JSON.stringify(value).replace(/_/g, '\\_').replace(/&/g, '\\&').replace(/%/g, '\\%');
//         return String(value).replace(/_/g, '\\_').replace(/&/g, '\\&').replace(/%/g, '\\%'); // Escape LaTeX special characters
//       }).join(' & ');
//       latexContent += ' \\\\ \\hline\n';
//     });
    
//     // Close LaTeX table
//     latexContent += '\\end{tabularx}\n\\caption{' + tableToFetch + ' Data}\n\\label{tab:' + tableToFetch + '}\n\\end{table}';
    
//     // Create and trigger download
//     const blob = new Blob([latexContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const downloadLink = document.createElement('a');
//     downloadLink.href = url;
//     downloadLink.download = `${tableToFetch}_table.tex`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//     URL.revokeObjectURL(url);
//   };

//   // Get column headers from the first data item
//   const columns = data.length > 0 ? Object.keys(data[0]) : [];

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <form onSubmit={handleFetchTable} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div className="flex gap-2 items-center">
//             <label htmlFor="tableInput" className="font-medium">Table Name:</label>
//             <input
//               id="tableInput"
//               type="text"
//               placeholder="Enter table name"
//               value={tableName}
//               onChange={(e) => setTableName(e.target.value)}
//               className="border rounded p-2"
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Fetch Data
//             </button>
//           </div>
          
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={exportAsImage}
//               disabled={loading || data.length === 0}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               Export as Image
//             </button>
//             <button
//               type="button"
//               onClick={exportAsLatex}
//               disabled={loading || data.length === 0}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               Export as LaTeX
//             </button>
//           </div>
//         </form>
//       </div>

//       {loading ? (
//         <div className="p-4">Loading data...</div>
//       ) : error ? (
//         <div className="p-4 text-red-500">Error: {error}</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <div ref={tableRef} className="bg-white p-4 border rounded shadow inline-block">
//             <h2 className="text-xl font-bold mb-4">{tableToFetch} Data</h2>
//             {data.length === 0 ? (
//               <p>No data available.</p>
//             ) : (
//               <table className="border-collapse table-auto">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     {columns.map((column) => (
//                       <th key={column} className="p-2 border whitespace-nowrap">
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
//                       {columns.map((column) => (
//                         <td key={`${rowIndex}-${column}`} className="p-2 border whitespace-nowrap">
//                           {typeof row[column] === 'object' ?
//                             JSON.stringify(row[column]) :
//                             String(row[column])}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React from "react"

const name = () => {

  return (
    <div>
      
    </div>
  )
};

export default name;
