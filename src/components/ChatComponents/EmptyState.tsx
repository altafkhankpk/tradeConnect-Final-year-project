import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col ml-5 w-[54%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col mt-16 max-md:mt-10 max-md:max-w-full">
        <h2 className="text-5xl font-extrabold text-zinc-800 max-md:max-w-full max-md:text-4xl">
          Pick up where you left off
        </h2>
        <p className="self-center mt-3 text-2xl font-medium tracking-wide text-zinc-600 max-md:max-w-full">
          Select a conversation and chat away
        </p>
      </div>
    </div>
  );
};

export default EmptyState;