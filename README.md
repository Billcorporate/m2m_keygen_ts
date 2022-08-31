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
const signed = Signature.sign({ secret: "my_secret_key", algorithm: "sha256" });

const signed = Signature.sign({ secret: "my_secret_key" }); // => Will default algorithm to sha512
```

#### Signing

Use the `sign` method to generate a new signature.

- `params` is a params hash. The order of keys isn't important as the lib will reformat them.
- `verb` is the http verb
- `path` is the path for the request

```ts
import { Signature } from "m2m-keygen";

Signature.sign({
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
import { Signature } from "m2m-keygen";

Signature.validate(
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
