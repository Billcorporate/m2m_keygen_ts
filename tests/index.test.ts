import * as All from '../src/index';

describe('Signature', () => {
  it('exposes sign', () => {
    expect(All.sign).toBeDefined();
  });

  it('exposes validate', () => {
    expect(All.validate).toBeDefined();
  });

  it('exposes secureCompare', () => {
    expect(All.secureCompare).toBeDefined();
  });

  it('exposes generateFetcher', () => {
    expect(All.generateFetcher).toBeDefined();
  });

  it('exposes translateParamsToQuery', () => {
    expect(All.translateParamsToQuery).toBeDefined();
  });
});
