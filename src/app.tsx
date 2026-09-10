import { useHashRoute } from './router/useHashRoute';
import { Layout } from './components/Layout';
import { FlashcardsPage } from './features/flashcards/FlashcardsPage';
import { TranslatePage } from './features/translate/TranslatePage';
import { ScenarioSelect } from './features/chat/ScenarioSelect';
import { ChatPage } from './features/chat/ChatPage';

export function App() {
  const [path, navigate] = useHashRoute();

  let content: JSX.Element;
  if (path.startsWith('/translate')) {
    content = <TranslatePage />;
  } else if (path.startsWith('/chat/')) {
    const scenarioId = path.slice('/chat/'.length);
    content = <ChatPage scenarioId={scenarioId} onExit={() => navigate('/chat')} />;
  } else if (path.startsWith('/chat')) {
    content = <ScenarioSelect onSelect={(id) => navigate(`/chat/${id}`)} />;
  } else {
    content = <FlashcardsPage />;
  }

  return (
    <Layout currentPath={path} onNavigate={navigate}>
      {content}
    </Layout>
  );
}
