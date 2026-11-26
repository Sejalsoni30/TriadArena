import { describe, it, expect } from 'vitest';
import { cn, formatNumber, truncateAddress } from './utils';

describe('Client UI Utils', () => {
  it('correctly merges classnames', () => {
    expect(cn('px-2', 'px-4', 'text-white')).toBe('px-4 text-white');
    expect(cn('bg-red-500', false && 'hidden', 'text-sm')).toBe('bg-red-500 text-sm');
  });

  it('formats numbers with international commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1500000)).toBe('1,500,000');
  });

  it('truncates long addresses and strings properly', () => {
    expect(truncateAddress('0x1234567890abcdef', 4)).toBe('0x12...cdef');
    expect(truncateAddress('', 4)).toBe('');
  });
});
