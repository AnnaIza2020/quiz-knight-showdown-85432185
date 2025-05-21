
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

// Add error handling for development mode
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen bg-red-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Something went wrong</h1>
      <pre className="bg-black/30 p-4 rounded overflow-auto max-w-[800px] max-h-[400px]">
        {error.message}
        {'\n\n'}
        {error.stack}
      </pre>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 bg-white text-red-900 px-4 py-2 rounded font-bold"
      >
        Try again
      </button>
    </div>
  );
};

// Error boundary for the root
class RootErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </RootErrorBoundary>
  </React.StrictMode>
);
