import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <header>
      <h1 className="text-7xl font-extrabold text-zinc-800 max-md:text-4xl">Chat</h1>
      <p className="mt-2.5 text-2xl font-medium text-zinc-600 max-md:max-w-full">
        Get more informations about your quote
      </p>
    </header>
  );
};

export default ChatHeader;