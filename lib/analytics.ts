// A shared split's names and amounts live after the "#", and the Privacy page promises analytics never sees them.
export const stripUrlFragment = <T extends { url: string }>(event: T): T => ({
  ...event,
  url: event.url.split("#")[0] ?? event.url,
});
