export interface ErrorStateProps {
  onRetry: () => void;
}

export interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}
