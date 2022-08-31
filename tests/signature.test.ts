import { sign, validate, secureCompare } from '../src/signature';

describe('#sign', () => {
  const secret = 'secret';
  const algorithm = 'sha256';
  const verb = 'get';
  const path = '/path';
  const params = { b: '1', a: '2' };

  it('returns signature', () => {
    expect(sign({ secret, algorithm, params, verb, path })).toEqual(
      // Signature generated using OpenSSL cli
      // echo "GET/patha=2&b=1" | perl -0 -pe 's/\n\Z//' | openssl sha256 -hmac "secret"
      '7d86fa8a7f871589697b0f41542d065b1ddbbe155e83349fffd937edcfa85af7'
    );
  });
});

describe('#validate', () => {
  const secret = 'secret';
  const algorithm = 'sha256';
  const verb = 'get';
  const path = '/path';
  const params = { b: '1', a: '2' };

  describe('with a valid signature', () => {
    const signature =
      '7d86fa8a7f871589697b0f41542d065b1ddbbe155e83349fffd937edcfa85af7';

    it('returns true', () => {
      expect(
        validate({ secret, algorithm, params, verb, path, signature })
      ).toBe(true);
    });
  });
  describe('with a invalid length signature', () => {
    const signature =
      '7d86fa8a7f871589697b0f41542d065b1ddbbe155e83349fffd937edcfa85af';

    it('returns false', () => {
      expect(
        validate({ secret, algorithm, params, verb, path, signature })
      ).toBe(false);
    });
  });
  describe('with a invalid signature', () => {
    const signature =
      '7d86fa8a7f871589697b0f41542d065b1ddbbe155e83349fffd937edcfa85af8';

    it('returns false', () => {
      expect(
        validate({ secret, algorithm, params, verb, path, signature })
      ).toBe(false);
    });
  });
});

describe('secureCompare', () => {
  it('return true if the strings are identical', () => {
    expect(secureCompare('abc', 'abc')).toBe(true);
  });

  it('return true if the strings are identical in utf8', () => {
    expect(secureCompare('你好世界', '你好世界')).toBe(true);
  });

  it('should return false if the strings are different lengths', () => {
    expect(secureCompare('abc', 'ab')).toBe(false);
  });

  it('should return false if the strings have different contents', () => {
    expect(secureCompare('abc', 'abd')).toBe(false);
  });
});
