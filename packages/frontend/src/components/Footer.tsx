import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full text-center py-4 mt-8 text-sm text-gray-600">
      © {new Date().getFullYear()} Kochi Buzz. All rights reserved.
    </footer>
  );
};

export default Footer