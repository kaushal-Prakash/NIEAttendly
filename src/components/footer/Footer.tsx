import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center space-y-4 mt-2">
        <div className="flex items-center space-x-4">
          <Link href="https://www.linkedin.com/in/devkaushalprakash/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-2xl hover:text-blue-400 transition-colors" />
          </Link>
          <Link href="mailto:savagegamer1289@gmail.com">
            <FaEnvelope className="text-2xl hover:text-blue-400 transition-colors" />
          </Link>
        </div>
        <div className="text-center">
           Made with 💖 for NIE
        </div>
      </div>
    </footer>
  );
};

export default Footer;
