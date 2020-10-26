# Purpose 

This project aim to compare different benchmark from different language.
A JSON file can contains multiple benchmark of different fonction. In every case it must respect the following [schema](https://github.com/edoshiwa/JSON-Comparator/blob/master/src/json-schema.json).

There is two non-exclusive way to use this projet:
* Associated with a distant or local server [see configuration](https://github.com/edoshiwa/JSON-Comparator/blob/master/README.md#Configuration).
  * You can add a WSS to fetch only when a new file is available.
* Using JSON from your local disk
A benchmark result is a JSON file, check 

## Configuration

You MAY want to change the following const url in [App.js](https://github.com/edoshiwa/JSON-Comparator/blob/master/src/App.js) if you use a distant server (with or without WSS):

`webSocketUrl` : URL of your WSS (You MAY want to configure the onopen function to secure the connection).

`localUrl` : core url of your local server.

`apiUrl` :extension url of the api (you SHOULD configure your API to have `GET` for filename and `GET` to fetch a specific file.

`urlParameters` : If your API if configured differently.

To have a better understanding of how it work here is a [diagram](https://github.com/edoshiwa/JSON-Comparator/blob/master/doc/img/WSS.png).

## Use 

In a dev environnement you could launch

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Then either select file from server or from your local disk.

