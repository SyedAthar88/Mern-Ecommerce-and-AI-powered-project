import { Component } from "react";
import ErrorFallback from "../pages/ErrorFallback.jsx";

// ==========================================
// ErrorBoundary — catches render-time errors
// in children and shows a fallback UI.
//
// NOTE: Must be a class component.
// React has no hook equivalent for error boundaries.
// ==========================================
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  // ==========================================
  // Called when a child throws during render.
  // Return new state to render the fallback.
  // ==========================================
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // ==========================================
  // Called after an error is caught.
  // Use for side effects like logging.
  // ==========================================
  componentDidCatch(error, errorInfo) {
    // Log to console in all environments for now.
    // In production, this is where you'd send to Sentry, LogRocket, etc.
    console.error("🔴 ErrorBoundary caught:", error);
    console.error("Component stack:", errorInfo?.componentStack);
  }

  // ==========================================
  // Reset the boundary — try rendering children again.
  // ==========================================
  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided? Use it.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback with reset capability.
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}