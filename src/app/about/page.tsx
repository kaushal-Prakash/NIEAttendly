import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-blue-100 text-blue-800 p-6 min-h-screen font-sans">
      <h1 className="text-3xl mt-20 md:mt-28 font-bold text-center mb-6 text-blue-900">About Attendly</h1>
      <p className="text-lg mb-4">
        Hey there! Welcome to <strong>Attendly</strong>! 🎉
      </p>
      <p className="text-lg mb-4">
        This is your go-to platform for managing attendance. Designed especially for students, 
        Attendly helps you keep track of your classes, so you never miss a beat and keep track of your attendance. 📚
      </p>
      <p className="text-lg mb-4">
      Attendly is a passion project, created with a lot of dedication and hard work to make it happen.
        As with any new project, you might encounter some bugs and notice a few features that are still a work in progress. 
        But don&apos;t worry, I&apos;m on it! 🔧
      </p>
      <p className="text-lg mb-4">
        Your feedback is super important to me, and I&apos;m committed to making improvements and adding 
        new features as needed. So, bear with me, and let&apos;s make Attendly the best it can be, together! 💪
      </p>
      <p className="text-lg mb-4">
        Thanks for being part of the Attendly community. I appreciate you! 🙌
      </p>
      <p className="text-lg text-center font-semibold">
        <strong>- Dev Shadow</strong>
      </p>
    </div>
  );
};

export default About;
