import { useMessages } from './context';

export default function ChatHistory() {
  const { message } = useMessages();

  return (
    <div>
      {message.messages.map(item => (
        <div key={item.id}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
