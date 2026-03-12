import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary glass">
                    <h2>Something went wrong.</h2>
                    <p>Please refresh the page or try again later.</p>
                    <button onClick={() => window.location.reload()}>Refresh</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
