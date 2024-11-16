import React from 'react';

const FAQs: React.FC = () => {
  return (
    <div className="bg-blue-100 text-blue-800 p-6 min-h-screen font-sans">
      <h1 className="text-3xl mt-20 md:mt-24 font-bold text-center mb-6 text-blue-900">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">What is Attendly?</h2>
          <p className="text-lg">Attendly is a platform designed to help students manage their attendance. It keeps track of your classes, ensuring you never miss an important session.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Can I track attendance for multiple subjects?</h2>
          <p className="text-lg">Yes, Attendly allows you to track attendance for multiple subjects, providing detailed insights for each one.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Is there a mobile app for Attendly?</h2>
          <p className="text-lg">Currently, Attendly is a web-based platform. However, we are working on developing a mobile app to enhance your experience.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">How can I provide feedback or report bugs?</h2>
          <p className="text-lg">We appreciate your feedback! Please send any feedback or bug reports to the email provided in the footer of our website.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
