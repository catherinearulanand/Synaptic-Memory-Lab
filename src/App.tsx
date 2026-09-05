import { AppProvider, useAppState } from './state/AppContext';
import { TopBar } from './components/TopBar';
import { Landing } from './components/Landing';
import { Laboratory } from './components/lab/Laboratory';

function Screen() {
  const { mode } = useAppState();
  return (
    <>
      <TopBar />
      {mode === 'landing' ? <Landing /> : <Laboratory />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Screen />
    </AppProvider>
  );
}

export default App;
