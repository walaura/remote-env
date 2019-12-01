#!/usr/bin/env node

require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const chalk = require("chalk");
const { configAt } = require("../src/config");

let existsAlready = false;

const info = msg => chalk.blue("ℹ️ " + msg);
const yay = msg => chalk.green("😻 " + msg);
const error = msg => chalk.red("🤯 " + msg);

const main = async () => {
  if (fs.existsSync(configAt)) {
    console.info(info("You got a config file already!"));
    existsAlready = true;
  }
  if (!process.env.REMOTE_ENV_URL) {
    if (existsAlready) {
      console.info(
        info(
          `You dont have ${chalk.white(
            "REMOTE_ENV_URL"
          )} set up but you already have a config file so it all worked out`
        )
      );
    } else {
      console.error(
        error(
          `Please set ${chalk.white(
            "REMOTE_ENV_URL"
          )} in your env or manually add a ${chalk.white("/.config.json")} file`
        )
      );
      process.exit(1);
    }
    return;
  }
  try {
    const config = await fetch(process.env.REMOTE_ENV_URL).then(res =>
      res.json()
    );
    fs.writeFileSync(configAt, JSON.stringify(config, null, "\t"));
    console.info(
      yay(
        existsAlready
          ? `Updated config in ${chalk.white(configAt)}`
          : `Downloaded config to ${chalk.white(configAt)}`
      )
    );
  } catch (e) {
    if (existsAlready) {
      console.error(e);
      console.error(
        info(
          `Unable to fetch config from ${chalk.white(
            process.env.REMOTE_ENV_URL
          )}. Using existing config. is it stale?`
        )
      );
    } else {
      console.error(e);
      console.error(
        error(
          `Unable to fetch config from ${chalk.white(
            process.env.REMOTE_ENV_URL
          )}. Please check the URL or manually add a ${chalk.white(
            "/.config.json"
          )} file`
        )
      );
      process.exit(1);
    }
  }
};

main();
