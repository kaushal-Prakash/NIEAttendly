'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@/components/table/Table';

interface SubjectData {
  name: string;
  total: number;
  present: number;
}

const Page: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/api/users/me');
        const { subjects } = response.data;
        setSubjects(subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className='w-full min-h-screen mt-20 grid place-content-center stats-container'>
      <div className='max-w-5xl -translate-y-52 stats-content'>
      <Table data={subjects} />
      </div>
    </div>
  );
}

export default Page;
