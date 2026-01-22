"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-brand-black px-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-brand-yellow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          เกิดข้อผิดพลาด
        </h1>
        <p className="text-gray-400 mb-6">
          {error?.message || "Something went wrong. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-brand-yellow text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-brand-black"
        >
          รีโหลดหน้านี้
        </button>
      </div>
    </div>
  );
}

// Specific error boundary for sections
export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="py-20 text-center" role="alert">
          <p className="text-gray-400">
            ไม่สามารถโหลดส่วนนี้ได้ กรุณาลองใหม่อีกครั้ง
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
