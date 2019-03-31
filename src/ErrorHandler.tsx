import React from 'react';
import ErrorMessage from './pages/ErrorMessage';
import NotFound from './pages/NotFound';
import { logError } from './utils/errorLogger';

interface ErrorHandlerState {
  errorType?: 'ERROR' | 'NOT_FOUND';
}

// todo: maybe build this global error handler thing
// it would log errors and display error messages in one place
// we would just `throw` whenever we want
export default class ErrorHandler extends React.Component<
  { children: React.ReactNode },
  ErrorHandlerState
> {
  state: ErrorHandlerState = {
    errorType: undefined,
  };

  componentDidCatch(error: Error & { code?: string }) {
    if (error && error.code === 'NOT_FOUND') {
      this.setState({ errorType: error.code });
      return;
    }

    this.setState({ errorType: 'ERROR' });
  }

  render() {
    if (this.state.errorType === 'ERROR') {
      return <ErrorMessage onNavigate={() => this.setState({ errorType: undefined })} />;
    }

    if (this.state.errorType === 'NOT_FOUND') {
      return <NotFound onNavigate={() => this.setState({ errorType: undefined })} />;
    }

    return <>{this.props.children}</>;
  }
}
