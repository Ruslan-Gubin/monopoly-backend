import chalk from "chalk";
 
export const chalks = {
  success: chalk.bgKeyword("green").white,
  errorDB: chalk.bgKeyword("white").redBright,
  InfoDev: chalk.bgBlackBright.white,
  warning: chalk.bgYellow.black,
}