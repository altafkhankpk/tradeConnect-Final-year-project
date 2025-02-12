import React from 'react';

const ChatTabs: React.FC = () => {
  return (
    <nav className="flex gap-6 mt-6 max-w-full text-xl font-bold text-white w-[436px]">
      <button className="grow px-7 py-4 bg-red-600 rounded-2xl w-fit max-md:px-5">
        Agents I am working with
      </button>
      <button className="gap-2.5 self-stretch px-7 py-4 rounded-2xl bg-red-600 bg-opacity-50 max-md:px-5">
        All chats
      </button>
    </nav>
  );
};

export default ChatTabs;