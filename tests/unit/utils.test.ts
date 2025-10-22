/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  truncate,
  capitalize,
  formatPercentage,
  unique,
  isValidEmail,
  formatFileSize,
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-05-15');
      expect(formatDate(date)).toBe('May 15, 2025');
    });

    it('handles string dates', () => {
      expect(formatDate('2025-05-15')).toBe('May 15, 2025');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncate(text, 20)).toBe('This is a very long...');
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      expect(truncate(text, 20)).toBe('Short text');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage correctly', () => {
      expect(formatPercentage(85)).toBe('85%');
    });

    it('rounds percentages', () => {
      expect(formatPercentage(85.7)).toBe('86%');
    });
  });

  describe('unique', () => {
    it('removes duplicates from array', () => {
      const array = [1, 2, 2, 3, 3, 3];
      expect(unique(array)).toEqual([1, 2, 3]);
    });

    it('works with strings', () => {
      const array = ['a', 'b', 'b', 'c'];
      expect(unique(array)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });
  });
});
