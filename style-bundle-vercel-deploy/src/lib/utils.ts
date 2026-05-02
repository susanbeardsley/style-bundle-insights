import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse semicolon-separated strings into arrays
export function parseSemicolonList(value: string | undefined): string[] {
  if (!value || value === '') return [];
  return value.split(';').map(s => s.trim()).filter(Boolean);
}

// Get strength colour for matrix cells
export function getStrengthColour(strength: string): string {
  switch (strength?.toLowerCase()) {
    case 'primary':
      return 'bg-gold-500 text-white';
    case 'secondary':
      return 'bg-sage-300 text-charcoal-600';
    case 'rare':
      return 'bg-ivory-300 text-charcoal-500';
    default:
      return 'bg-gray-100 text-gray-400';
  }
}

// Get sentiment family colour
export function getSentimentFamilyColour(family: string): string {
  const colours: Record<string, string> = {
    love: 'bg-blush text-charcoal-600',
    gratitude: 'bg-gold-200 text-charcoal-600',
    celebration: 'bg-yellow-200 text-charcoal-600',
    comfort: 'bg-sage-200 text-charcoal-600',
    encouragement: 'bg-blue-200 text-charcoal-600',
    acknowledgement: 'bg-kraft-200 text-charcoal-600',
    apology: 'bg-purple-200 text-charcoal-600',
    nostalgia: 'bg-amber-200 text-charcoal-600',
    playful: 'bg-red-200 text-charcoal-600',
  };
  return colours[family] || 'bg-gray-200 text-charcoal-600';
}

// Get category colour
export function getCategoryColour(category: string): string {
  const colours: Record<string, string> = {
    life_milestone: 'bg-gold-100 text-gold-600 border-gold-300',
    calendar: 'bg-sage-100 text-sage-600 border-sage-300',
    cultural: 'bg-terracotta/20 text-terracotta border-terracotta/40',
    professional: 'bg-charcoal-100 text-charcoal-500 border-charcoal-200',
    spontaneous: 'bg-blush-light text-rose-600 border-rose-200',
    sympathy: 'bg-ivory-300 text-charcoal-400 border-charcoal-200',
  };
  return colours[category] || 'bg-gray-100 text-gray-600 border-gray-200';
}

// Format price tier display
export function formatPriceTier(min: number, max: number): string {
  return `$${min} – $${max}`;
}

// Format category for display
export function formatCategory(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Australian date formatting
export function formatDateAU(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Simple password hash check (for demo - in production use proper auth)
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
