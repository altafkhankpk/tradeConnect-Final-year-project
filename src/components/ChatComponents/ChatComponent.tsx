
import ChatHeader from './ChatHeader';
import ChatTabs from './ChatTabs';
import MessageList from './MessageList';
import EmptyState from './EmptyState';

const ChatComponent: React.FC = () => {
  return (
    <main className="flex flex-col items-start px-20 py-20 bg-white rounded-[70px] max-md:px-5">
      <ChatHeader />
      <ChatTabs />
      <section className="flex gap-7 mt-16 max-md:mt-10">
        <h2 className="text-4xl font-medium basis-auto text-zinc-800">Messages</h2>
        <div className="flex flex-col my-auto">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/328bd4dadd77613e8f0da4b86e8aaa72ab5e575654ab660594fb621198fb2516?placeholderIfAbsent=true&apiKey=f1395c226c2e4bb1aa5747f8864caedf" className="object-contain aspect-[0.97] w-[30px]" alt="" />
        </div>
      </section>
      <div className="mt-9 ml-3.5 w-full max-w-[1284px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <MessageList />
          <EmptyState />
        </div>
      </div>
    </main>
  );
};

export default ChatComponent;