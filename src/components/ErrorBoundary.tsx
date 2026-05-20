"use client";

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: "" };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
                        <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                            Something went wrong
                        </p>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                            {this.state.message || "An unexpected error occurred. Please refresh the page."}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, message: "" })}
                            className="rounded-full px-5 py-2 text-sm font-semibold text-black"
                            style={{ backgroundColor: "#f5c518" }}
                        >
                            Try again
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
