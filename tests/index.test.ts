import { Signature } from '../src/index';

describe('Signature', () => {
  it('exposes sign', () => {
    expect(Signature.sign).toBeDefined();
  });

  it('exposes validate', () => {
    expect(Signature.validate).toBeDefined();
  });
});
