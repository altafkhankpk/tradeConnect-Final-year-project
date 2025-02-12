import React from 'react';

export interface MessageItemProps {
  imageSrc: string;
  name: string;
  time: string;
  lastMessage: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ imageSrc, name, time, lastMessage }) => {
  return (
    <div className="flex flex-wrap gap-6 pr-2.5 mt-10 w-full max-md:max-w-full">
      <img loading="lazy" src={imageSrc} className="object-contain shrink-0 rounded-full aspect-square w-[75px]" alt={`${name}'s profile`} />
      <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit">
        <div className="flex gap-5 justify-between">
          <div className="text-3xl font-semibold text-zinc-800">{name}</div>
          <div className="text-2xl font-medium text-stone-300">{time}</div>
        </div>
        <div className="self-start mt-3.5 text-2xl font-medium text-stone-300">{lastMessage}</div>
      </div>
    </div>
  );
};

export default MessageItem;