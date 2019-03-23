import React from 'react';
import ErrorMessage from './pages/ErrorMessage';
import NotFound from './pages/NotFound';

interface ErrorHandlerState {
  errorType?: 'ERROR' | 'NOT_FOUND';
  userMessage?: string;
}

// todo: maybe build this global error handler thing
// it would log errors and display error messages in one place
// we would just `throw` whenever we want
export default class ErrorHandler extends React.Component<{}, ErrorHandlerState> {
  state: ErrorHandlerState = {
    errorType: undefined,
    userMessage: undefined,
  };

  componentDidCatch(error: any) {
    if (error && error.isThowable) {
      this.setState({ errorType: error.type, userMessage: error.userMessage });
    }
  }

  render() {
    if (this.state.errorType === 'ERROR') {
      return <ErrorMessage message={this.state.userMessage} />;
    }

    if (this.state.errorType === 'NOT_FOUND') {
      return <NotFound message={this.state.userMessage} />;
    }
  }
}
