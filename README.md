# Timestamp Microservice

Timestamp Microservice made in node for freeCodeCamp

[Live](https://timestamp-node-rpbinkoiwf.now.sh) version, _needs time to
boot up_.

Based on [Micro](https://github.com/zeit/micro) http microservice
server and deployed on [Now](https://zeit.co/now).

Internally [Moment.js](https://momentjs.com) is used to parse query
pathname url and return a json object with unix-timestamp and a natural
representation of date.

Supports [parsing](https://momentjs.com/docs/#/parsing/) from Moment.js.

On build will `public` folder contain bunldled `index.js` ready to be
served.

---

**Example Usages:**

[https://timestamp-node-rpbinkoiwf.now.sh/December%2015,%202015](https://timestamp-node-thjqtmfyik.now.sh/December%2015,%202015)

[https://timestamp-node-rpbinkoiwf.now.sh/1450137600](https://timestamp-node-thjqtmfyik.now.sh/1450137600)

[https://timestamp-node-rpbinkoiwf.now.sh/](https://timestamp-node-thjqtmfyik.now.sh/)

**Example Output:**

```javascript
{
    "unix": "1450137600000",
    "natural": "Tuesday, December 15, 2015 12:00 AM"
}
```

## Usage

Yarn or Npm can be used to run the commands.

`yarn dev` to start micro-dev for development.

`yarn format` to format code using prettier

`yarn build` to build for production with output in public directory.

`yarn start` to serve public directory via micro.

## Development

Latest Node.js LTS is required.

Husky and lint-staged are used to keep code consistent.

## License

[MIT](LICENSE)
