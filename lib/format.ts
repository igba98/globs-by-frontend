export function formatTzs(n: number): string {
  return 'TZS ' + new Intl.NumberFormat('en-US').format(n);
}
