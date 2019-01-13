# Subtitle Player

A subtitle player in your browser. Able to play .srt subtitle file standalone without videoes. 

[Demo](https://asvrada.github.io/vue-subtitle-player/)

## Requirements 

Make sure you have following tools installed on your system:

* [node.js](https://nodejs.org/)
* [yarn](https://yarnpkg.com/)

## Getting Started

First, clone/download this repo

`git clone https://github.com/asvrada/vue-subtitle-player.git`

Under this repo, install dependency for this project

`yarn install`

After this point, you can check the `package.json` to see available actions under `scripts` section.

```bash
# To run in the browser:
yarn run serve

# To build production build
yarn run build

# etc...
```

## Todo
2. Support modifier in subtitle like \<i\>
3. Load script from URL
4. DropZone should validate type of file
1. add keyboard support
    2. left/right arrow key: move time backward/forward

## License

[MIT](https://opensource.org/licenses/MIT)
