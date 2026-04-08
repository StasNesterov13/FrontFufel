export const toISODate = (date: Date): string => date.toISOString().split('T')[0];
export const toISOString = (date: string): string => date.split('T')[0];
