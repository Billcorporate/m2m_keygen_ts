import { hello } from '../src/index';

describe('hello', () => {
  it('works', () => {
    expect(hello).toBe('Hello World');
  });
});
