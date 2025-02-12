import React from 'react';
import MessageItem, { MessageItemProps } from './MessageItem';

const messages: MessageItemProps[] = [
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/364156e06f9f8d5f7f497246e45abc3427ba4be5ed0ff1f847162ae53e3d61b5?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf",
    name: "Sample User",
    time: "34 minutes",
    lastMessage: "Me: We spoke about the..."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6fcb942c618f582c304287481a22032df5965423cb3b76a2ba7cb70600c56184?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf",
    name: "User Sample",
    time: "51 minutes",
    lastMessage: "Me: We spoke about the..."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d03a86308510f69abacd43417ca8494c6250b219221c0209f00ba8eff46b06ce?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf",
    name: "Alex Bodor",
    time: "1 hrs",
    lastMessage: "Me: We spoke about the..."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/3444d19fb9737f18cfaf4abacf809c92f1ef3f73b4c4c974af2dfb0bd5d8f40c?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf",
    name: "Ghro Maby",
    time: "2 days",
    lastMessage: "Me: We spoke about the..."
  },
  {
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e18c1b260c3a66d53bf82972827ea9a1b377196ef92a54970f0607a8f240182b?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf",
    name: "Shfe Ahng",
    time: "One week",
    lastMessage: "Me: We spoke about the..."
  }
];

const MessageList: React.FC = () => {
  return (
    <div className="flex flex-col w-[46%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
        {messages.map((message, index) => (
          <MessageItem key={index} {...message} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;