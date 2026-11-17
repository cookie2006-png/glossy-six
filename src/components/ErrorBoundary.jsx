import React from "react";

// Shows the real error on screen instead of a blank white page.
export default class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif", color: "#4A2630" }}>
        <h1 style={{ fontSize: 22 }}>Oops, something broke</h1>
        <p>Please send this message to your developer:</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#FBE3E8", padding: 12, borderRadius: 8 }}>
          {String(this.state.error && (this.state.error.stack || this.state.error.message || this.state.error)).slice(0, 900)}
        </pre>
      </div>
    );
  }
}
