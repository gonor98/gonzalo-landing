import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Algo salió mal</p>
          <h1 className="mt-4 font-display text-3xl text-white">Recargá la página</h1>
          <p className="mt-3 text-white/60 text-sm">
            Tuvimos un problema mostrando esta sección. Probá recargar — si persiste, escribinos.
          </p>
          <button
            onClick={() => {
              this.reset();
              window.location.reload();
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;