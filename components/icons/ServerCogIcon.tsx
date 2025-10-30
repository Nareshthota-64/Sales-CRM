import React from 'react';

const ServerCogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1" />
    <path d="M12 10v4" />
    <path d="M5 18H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9.5V7" />
    <path d="M12 17v-2.5" />
    <path d="M14.5 14.5 16 16" />
    <path d="M8 8 9.5 9.5" />
    <path d="M16 8 14.5 9.5" />
    <path d="M9.5 14.5 8 16" />
    <path d="M7 12h2.5" />
    <path d="M17 12h-2.5" />
  </svg>
);

export default ServerCogIcon;