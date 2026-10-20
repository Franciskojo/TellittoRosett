import { describe, expect, it } from 'vitest';
import { appointmentCreateSchema, articleSchema, registerSchema } from './validation';

describe('registerSchema', () => {
  const valid = { name: 'Ama', email: ' Ama@Example.com ', password: 'abcdef12' };

  it('normalises email and defaults phone', () => {
    const r = registerSchema.parse(valid);
    expect(r.email).toBe('ama@example.com');
    expect(r.phone).toBe('');
  });

  it('ignores a client-supplied role', () => {
    const r = registerSchema.parse({ ...valid, role: 'staff' });
    expect('role' in r).toBe(false);
  });

  it('rejects weak passwords', () => {
    expect(() => registerSchema.parse({ ...valid, password: 'short1' })).toThrow();
    expect(() => registerSchema.parse({ ...valid, password: 'onlyletters' })).toThrow();
    expect(() => registerSchema.parse({ ...valid, password: '12345678' })).toThrow();
  });

  it('rejects invalid email', () => {
    expect(() => registerSchema.parse({ ...valid, email: 'nope' })).toThrow();
  });
});

describe('appointmentCreateSchema', () => {
  const base = {
    patientName: 'Ama',
    phone: '0241234567',
    email: 'ama@example.com',
    reason: 'Checkup',
    serviceId: 'antenatal',
    date: '2026-09-16',
    time: '9:00 AM',
  };

  it('strips client-controlled price and status fields', () => {
    const r = appointmentCreateSchema.parse({ ...base, fee: 1, total: 1, status: 'Completed' });
    expect(r).not.toHaveProperty('fee');
    expect(r).not.toHaveProperty('total');
    expect(r).not.toHaveProperty('status');
  });

  it('rejects bad dates', () => {
    expect(() => appointmentCreateSchema.parse({ ...base, date: '16/09/2026' })).toThrow();
  });

  it('rejects an empty or missing phone number', () => {
    expect(() => appointmentCreateSchema.parse({ ...base, phone: '' })).toThrow(/Phone number is required/);
    expect(() => appointmentCreateSchema.parse({ ...base, phone: '   ' })).toThrow(/Phone number is required/);
  });
});

describe('articleSchema', () => {
  it('rejects unknown categories', () => {
    expect(() => articleSchema.parse({ title: 'x', category: 'Hacking' })).toThrow();
  });
});
