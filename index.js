import chalk from 'chalk';
import fs from 'fs/promises';
import {formatDistanceToNow, isAfter, isBefore, parse, format, isToday, set, isValid} from 'date-fns'
import {Command} from 'commander';
import getGitVersion from './src/getGitVersion.js';

const gitVersion = await getGitVersion()
console.log(`git version: ${gitVersion}`);

const first = 'Ida'
const last = 'Åkermark'
const name = `${chalk.blueBright(first)} ${chalk.redBright(last)}`
console.log("name", name)

console.log(`npm & node: ${process.env.npm_config_user_agent}`)


const startOfCourse = new Date(2023, 0, 31)
const daysFromStart = (formatDistanceToNow(startOfCourse))
const today = format(new Date(), "yyyy-MM-dd HH:mm:ss z");

const argumentParser = new Command();
argumentParser.option('--date')
argumentParser.parse();

const dateStringSentAsArgument = argumentParser.args[0]
const dateSentAsArgument = parse(dateStringSentAsArgument, 'yyyy-MM-dd', new Date())
const currentDate = set(new Date(), {hours: 0, minutes: 0, seconds: 0, milliseconds: 0})

const isTodayArgument = isToday(dateSentAsArgument);
const isAfterArgument = isAfter(dateSentAsArgument, currentDate);
const isBeforeArgument = isBefore(dateSentAsArgument, currentDate);
const dateArgument = isValid(dateSentAsArgument); 

if(!dateArgument) {
    console.log("date format is 'yyyy-MM-dd");
} else {
    checkArguedDate(dateSentAsArgument);
}

function checkArguedDate() {
    if(isBeforeArgument) {
        console.log('That date takes place before todays date');
        return;
    } 

    if(isTodayArgument){
        console.log('That date is today!');
        return;
    }

    if(isAfterArgument){
        console.log('That date takes place after todays date');
        return;
    }
}

const fileContent = `
name: ${first} ${last}
npm & node: ${process.env.npm_config_user_agent}
git version: ${gitVersion}
date: ${today}
days since we started the course: ${daysFromStart}
`;
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
    <head>
        <title>week 2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="src/styles.css">
    </head>
    <body>
        <header>
            <h1>Assignment 2</h1>
        </header>
        <main>
            <div class='container'>
                <p>Name:</p>
                <p>${first} ${last}</p>
            </div>
            <div class='container'>
                <p>Start of course:</p>
                <p>${daysFromStart} ago</p>
            </div>
            <div class='container'>
                <p>Todays date is:</p>
                <p>${today}</p>
            </div>
            <div class='container'>
                <p>Local version specifications:</p>
                <p>npm & node: ${process.env.npm_config_user_agent}</p>
                <p>git version: ${gitVersion}</p>
            </div>
        </main>
        <footer>
            <h3>Ida Åkermark, assignment 2</h3>
        </footer>
    </body>
</html>
`

await fs.writeFile("index.html", htmlContent);
await fs.writeFile("index.md", fileContent);
