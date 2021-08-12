# Log File Reader

This project contains a script to help extract information from a 3D Systems RTF log file.

To use this project, you need [Node.js v14+](https://nodejs.org/en/) installed.

## Running the Script

To run the script, navigate to this project in the terminal. Then run:

```sh
node . /path/to/your/log-file.rtf
```

To search for a particular string, you can add an additional argument inside quotation marks. For example:

```sh
node . /path/to/your/log-file.rtf "umbilical heater"
```

## Development

Install [Yarn](https://yarnpkg.com/), then go to the terminal and run:

```sh
yarn
```

You can develop the project simply by following the instructions above.
