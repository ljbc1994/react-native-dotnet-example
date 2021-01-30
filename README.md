# react-native-dotnet-example

Proof of concept for a React Native application with a dotnet web application (api powered by swagger), in progress...

## Setup

Single source of truth to generate a React Native iOS, Android and Web application (with dotnet 5).

Contains a dotnet api with Swagger to generate a single TypeScript client for all apps (code reuse woo!):

```bash
npm run generate-client
```

## Required

Will need to add env variables as follows: 

### `env`

If we're running from an emulator, localhost refers to the emulator rather than to your computer... so you'll need to put in 
your ip address.

```js
module.exports = {
    "API_URL": "http://[IP ADDRESS]:5000"
};
```

### What it do
- Generates React Native iOS and Android applications
- Generates a Dotnet 5 / Node application with SSR support (`JavaScriptViewEngine`)
- Generates an API shared by all applications with a TypeScript generated client from Swagger
- CI to build and test all the apps
- Dedupe a lot of shared code (`webpack.client.js` and `webpack.server.js` can be abstracted)

## TODO

- Tidy everything up
- Style stuff
- Better setup for SSR (Currently needs to run `web:ssr` then `web`)
- `NodeServices` is obselete in latest dotnet so can use another JS engine at some point
- Login / Sign up support?

## Using

- Ported over the [JavaScriptViewEngine](https://github.com/pauldotknopf/JavaScriptViewEngine) from `@pauldotknopf` to .NET 5 for SSR.

## Issues I've found

- If I want a desktop navigation, SSR generates the mobile view because it doesn't know the dimensions of the screen and there's no way
  of detecting the dimensions?
- I want to debug SSR with `JavaScriptViewEngine` but seems to break?
