import inquirer from "inquirer";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";

const isAbsoluteUrl = (url) => {
  return new Promise((resolve, reject) => {
    if (typeof url !== "string") {
      reject("Must provide an absolute URL.");
    }

    url = url.trim();
    if (url.includes(" ")) {
      return false;
    }

    try {
      new URL(url.startsWith("//") ? `https:${url}` : url);
      resolve(true);
    } catch (e) {
      reject("Must provide an absolute URL.");
    }
  });
};

const hasInput = (value) => {
  return new Promise((resolve, reject) => {
    value && value.trim().length ? resolve(true) : reject("Input is required.");
  });
};

const INSTANCE_QUESTIONS = [
  {
    type: "input",
    name: "instanceUrl",
    message: "What is the instance URL?",
    validate: isAbsoluteUrl,
  },
  {
    type: "password",
    name: "apiKey",
    message: "What is the API Key for this instance?",
    validate: hasInput,
  },
  {
    type: "input",
    name: "nickname",
    message: "What is the nickname for this instance?",
    validate: hasInput,
  },
];

const prompts = async () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt(INSTANCE_QUESTIONS).then(resolve).catch(reject);
  });
};

(async () => {
  if (!existsSync(".env")) {
    const instance = await prompts();
    console.log("Generating env file...");
    const fileName = path.resolve(process.cwd(), ".env");
    const data = `TI_INSTANCE_NAME=${instance.nickname}\nTI_API_INSTANCE=${instance.instanceUrl}\nTI_API_KEY=${instance.apiKey}`;

    return writeFile(fileName, data);
  }
})();
