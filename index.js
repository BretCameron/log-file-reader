import { readFileSync } from "fs";

if (process.argv.length < 3) {
  throw new Error("A path to the log file must be provided.");
}

const filePath = process.argv[2];
const searchQuery =
  process.argv.length > 3 ? new RegExp(process.argv[3], "i") : "";

const lines = readFileSync(filePath, "utf8").split(`\n`);

const obj = {};

const regex = {
  model: /(?<=\[ ba8\] Model:\s+).+/,
  serialNumber: /(?<=\[ ba8\] S\/N:\s+).+/,
  printerName: /(?<=\[ ba8\] Printer\sName:\s+).+/,
  version: /(?<=\[ ba8\] Version:\s+).+/,
  networkConfig: /(?<=\[ ba8\] Network\sConfig:\s+).+/,
  clock: /(?<=\[ ba8\] Clock:\s+).+/,
};

for (const line of lines) {
  if (regex.model.test(line)) {
    obj.model = line.match(regex.model)[0].trim();
  } else if (regex.serialNumber.test(line)) {
    obj.serialNumber = line.match(regex.serialNumber)[0].trim();
  } else if (regex.printerName.test(line)) {
    obj.printerName = line.match(regex.printerName)[0].trim();
  } else if (regex.version.test(line)) {
    const fullString = line.match(regex.version)[0].trim();
    obj.version = {
      number: fullString.match(/(?<=\')[\d\.]+(?=\')/)[0],
      time: fullString.match(/(?<=\'[\d\.]+',\s).*/)[0],
    };
  } else if (regex.networkConfig.test(line)) {
    obj.networkConfig = line.match(regex.networkConfig)[0].trim();
  } else if (regex.clock.test(line)) {
    obj.clock = line.match(regex.clock)[0].trim().slice(0, 24);
  }

  if (/SetFailureInfo/i.test(line)) {
    obj.failureInfo = obj.failureInfo || new Set();
    obj.failureInfo.add(line.slice(50).trim().replace("\\par", ""));
  }

  if (searchQuery && searchQuery.test(line)) {
    obj.query = obj.query || new Set();
    obj.query.add(line.slice(50).trim().replace("\\par", ""));
  }
}

const { model, serialNumber, printerName, version, clock, failureInfo, query } =
  obj;

const { log, table } = console;
const cyan = "\x1b[36m%s\x1b[0m";

log(cyan, "MODEL INFO");

table({
  Model: model,
  ["Serial Number"]: serialNumber,
  ["Printer Name"]: printerName,
  Version: version.number,
  ["Time of Version"]: version.time,
  ["Time of Log"]: clock,
});

log(cyan, "FAILURE INFO");

table(failureInfo);

if (query) {
  log(cyan, "SEARCH QUERY");
  table(query);
}
