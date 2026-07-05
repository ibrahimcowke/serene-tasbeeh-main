import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            height: '100dvh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050210',
            padding: '2rem',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>
            Something went wrong
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <pre style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.65rem',
            maxWidth: '90vw',
            overflow: 'auto',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {this.state.error?.stack?.slice(0, 600)}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              background: '#fbbf24',
              color: '#050210',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
