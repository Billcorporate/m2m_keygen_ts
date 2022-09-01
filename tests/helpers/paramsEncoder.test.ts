import {
  encodes,
  translateParamsToQuery,
} from '../../src/helpers/paramsEncoder';

describe('translateParamsToQuery', () => {
  it('translate params to query', () => {
    expect(
      translateParamsToQuery({
        a: 1,
        b: '2',
        c: true,
        d: false,
        e: [1, 2, 3],
        f: { a: 1, b: 2 },
        g: null,
      })
    ).toEqual(
      '?a=1&b=2&c=true&d=false&e[]=1&e[]=2&e[]=3&f[a]=1&f[b]=2&g=false'
    );
  });

  describe('when there is nothing in params ', () => {
    it('returns empty string', () => {
      expect(translateParamsToQuery({})).toEqual('');
    });
  });
});

describe('paramsEncoder', () => {
  describe('simple useCase', () => {
    it('encodes params', () => {
      expect(encodes({ a: '1', b: '2' })).toEqual('a=1&b=2');
    });
  });

  describe('empty params', () => {
    it('encodes params', () => {
      expect(encodes({})).toEqual('');
    });
  });

  describe('null params', () => {
    it('encodes params', () => {
      expect(encodes(null)).toEqual('');
    });
  });

  describe('undefined params', () => {
    it('encodes params', () => {
      expect(encodes(undefined)).toEqual('');
    });
  });

  describe('param with null value', () => {
    it('encodes params', () => {
      expect(encodes({ a: 1, b: null })).toEqual('a=1');
    });
  });

  describe('param with undefined value', () => {
    it('encodes params', () => {
      expect(encodes({ a: 1, b: undefined })).toEqual('a=1');
    });
  });

  describe('param with empty string value', () => {
    it('encodes params', () => {
      expect(encodes({ a: 1, b: '' })).toEqual('a=1');
    });
  });

  describe('when params are not alphabetical', () => {
    it('encodes params', () => {
      expect(encodes({ c: 1, a: 2, b: 3 })).toEqual('a=2&b=3&c=1');
    });
  });

  describe('array value', () => {
    describe('with empty array value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: [] })).toEqual('a=1&b=[]');
      });
    });

    describe('with array value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: ['1', '2'] })).toEqual('a=1&b=["1","2"]');
      });
    });
  });

  describe('hash value', () => {
    describe('with empty hash value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: {} })).toEqual('a=1&b={}');
      });
    });

    describe('with hash value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: { c: '1', d: 2 } })).toEqual(
          'a=1&b={"c":"1","d":2}'
        );
      });
    });

    describe('with hash value with array value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: { d: ['1', '2'], c: 1 } })).toEqual(
          'a=1&b={"c":1,"d":["1","2"]}'
        );
      });
    });

    describe('with hash value with hash value', () => {
      it('encodes params', () => {
        expect(encodes({ a: 1, b: { d: { f: 3, e: '1' }, c: 1 } })).toEqual(
          'a=1&b={"c":1,"d":{"e":"1","f":3}}'
        );
      });
    });
  });
});
