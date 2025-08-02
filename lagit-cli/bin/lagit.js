#!/usr/bin/env node
import {Command} from 'commander';
import init from '../commands/init.js';
// import init from '../commands/init.js';
// import login from '../commands/login.js';
// import commit from '../commands/commit.js';
// import push from '../commands/push.js';
// import pull from '../commands/pull.js';
// import status from '../commands/status.js';
// import log from '../commands/log.js';


const program = new Command();

program
    .command("init-login <username> <password>")
    .description("initialize a lagit repo and login to your account")
    .action(init)


// program 
//     .command("login <username> <password>")
//     .description("login to your lagit user")
//     .action(login)


// program
//     .command("commit -m <message>")
//     .description("add a commit message")
//     .action(commit)


// program
//     .command("push")
//     .description("push your code to lagit server")
//     .action(commit)

program.parse(process.argv);