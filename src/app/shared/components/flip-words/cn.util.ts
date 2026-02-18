// Utility function to merge class names (Angular version of cn)
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}
