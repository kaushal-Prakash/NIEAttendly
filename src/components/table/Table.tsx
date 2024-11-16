'use client'
import React from 'react';

// Define the type for the subject data
interface SubjectData {
  name: string;
  total: number;
  present: number;
}

// Define the props for the component
interface TableProps {
  data: SubjectData[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div>
      <h1 className='font-semibold text-blue-600 text-center m-3 text-lg sm:md-2xl md:text-3xl'>Subjects Statistics : Total - {data.length}</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Subject</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Total Classes</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Classes Attended</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Attendance Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row.name}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{row.total}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{row.present}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>
                {((row.present / row.total) * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
