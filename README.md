# M2mKeygen

This gem exists for simplifying Machine to Machine signature generation and verification in a secure way.

## Installation

Install the gem and add to the application's Gemfile by executing:

    $ yarn add m2m-keygen

or if using npm

    $ npm install --save m2m-keygen

## Usage

### Signature

This gem provides a module for signing and checking signature for HTTP requests

Every method will use your secret key and eventually an encryption algorithm.

```ts
import { sign } from 'm2m-keygen';

const signed = sign({ secret: "my_secret_key", algorithm: "sha256", ... });

const signed = sign({ secret: "my_secret_key", ... }); // => Will default algorithm to sha512
```

#### Signing

Use the `sign` method to generate a new signature.

- `params` is a params hash. The order of keys isn't important as the lib will reformat them.
- `verb` is the http verb
- `path` is the path for the request

```ts
import { sign } from "m2m-keygen";

sign({
  secret: "my_secret_key",
  params: {
    a: "test",
    b: 1,
    d: ["a", "b"],
    c: {
      e: 45,
    },
  },
  verb: "get",
  path: "/path",
}); // => "a52168521868ebb37a38f90ec943163d9acb6ceb982206f437e1feb9ca32e7c1a8edef68f0ff4e195aeca1da93ae9afc8da214cb51a812fc6cc3730fdc7613fa"
```

After generating the signature send it alongside your request for verification on the receiver side.

#### Verifying

Use the `validate` method to verify that a received signature correspond to the HTTP request.

- `params` is a params hash. The order of keys isn't important as the lib will reformat them.
- `verb` is the http verb
- `path` is the path for the request
- `signature` is the received signature

```ts
import { validate } from "m2m-keygen";

validate(
  secret: "my_secret_key",
  params: {
    a: "test",
    b: 1,
    d: ["a", "b"],
    c: {
      e: 45,
    },
  },
  verb: "get",
  path: "/path",
  signature:
    "a52168521868ebb37a38f90ec943163d9acb6ceb982206f437e1feb9ca32e7c1a8edef68f0ff4e195aeca1da93ae9afc8da214cb51a812fc6cc3730fdc7613fa"
) // => true
```

If the validation is true, the request was signed with the same algorithm and same secret key.

#### Fetch API with auto signature generation and expiry

An helper as been added to generate a fetch function that will automatically sign the request and add an expiry.

The `fetcher` argument is any function that is compatible with the fetch API.

The result behaves slightly differently than a normal fetch function. It expects you to use 3 arguments:

- The first one is the path without any query arguments
- The second one is an object with the params to be sent
- The last one is anything you would like to pass to the fetch function as a second argument (method, headers, …).

The fetcher will add an expiry date to 90 seconds in the future (unless a previous expiry is already in params).
It will then transform the params into query arguments or encode them as JSON in the body depending on the method (GET, POST, …) you use.

```ts
import { generateFetcher } from "m2m-keygen";

const fetcher = generateFetcher({
  fetcher: fetch, // fetch can be any function compatible with the fetch API
  secret: "secret",
  algorithm: "sha512", // optional, default to sha512
  headerName: "X-Signature", // optional, default to X-Signature
});

// The generated fetcher, except for the params/body/query will behave exactly like fetch does.
fetcher(
  "http://example.com/oki",
  { a: 1, b: 2 },
  { method: "post", headers: { "My-Header": "Yay" } }
)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

#### Helpers

This lib exposes a few helpers that can be used in other projects.

##### translateParamsToQuery

This helper will translate a params hash to a query string.

```ts
import { translateParamsToQuery } from "m2m-keygen";

translateParamsToQuery({
  a: 1,
  b: "2",
  c: true,
  d: false,
  e: [1, 2, 3],
  f: { a: 1, b: 2 },
  g: null,
}); // => '?a=1&b=2&c=true&d=false&e[]=1&e[]=2&e[]=3&f[a]=1&f[b]=2&g=false'
```

##### secureCompare

This helper will compare two strings in a secure way.
Extracted from: [vadimdemedes/secure-compare](https://github.com/vadimdemedes/secure-compare)

```ts
import { secureCompare } from "m2m-keygen";

secureCompare("abc", "abc"); // => true

secureCompare("你好世界", "你好世界"); // => true

secureCompare("abc", "ab"); // => false

secureCompare("abc", "abd"); // => false
```

## How does it works

This is intended for a secure discussion between 2 servers and not something in a browser as the secret key must be stored and used both side (and you don't want to send the secret key in the browser).

Both server will have the same secret key.
The sender will generate a signature matching the HTTP request it will be sending and add it to the request in a designated header.
The receiver will generate the same signature from the HTTP request it has received and will compare it with the signature in the header.

The comparison will be done in constant time (i.e. secure) because both string will be hexdigest from a HMAC with the same algorithm.

## Development

After checking out the repo, run `yarn install` to install dependencies. Then, run `yarn test` to run the tests.

Every commit/push is checked by husky.

Tool used in dev:

- ESlint
- Prettier
- TypeScript
- Jest

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/BillCorporate/m2m_keygen_ts. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/BillCorporate/m2m_keygen_ts/blob/main/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the M2mKeygen project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/BillCorporate/m2m_keygen_ts/blob/main/CODE_OF_CONDUCT.md).
