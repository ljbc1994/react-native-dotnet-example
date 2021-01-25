# react-native-dotnet-example

Proof of concept for a React Native application with a dotnet web application (api powered by swagger), in progress...

## Setup

Single source of truth to generate a React Native iOS, Android and Web application (with dotnet 5).

Contains a dotnet api with Swagger to generate a single TypeScript client for all apps (code reuse woo!):

```bash
npm run generate-client
```

## Required

Will need to add a `config.js` file, and if you're connecting locally to the api, you'll need a separate config for `config.web.js`:

### `config.js`

If we're running from an emulator, localhost refers to the emulator rather than to your computer... so you'll need to put in 
your ip address.

```js
module.exports = {
    "API_URL": "http://[IP ADDRESS]:5000"
};
```

### `config.web.js`

```js
module.exports = {
    "API_URL": "https://localhost:5001"
};
```

## TODO
1. Add a sample state management 
2. Add a sample form library
3. Set up CI (GitHub Actions) for building + testing web, android and ios applications.
   - Use tagging to restrict building unnecessarily for a commit?
4. Potentially support SSR (either view engine node processing or react.net), depends on benefit.
