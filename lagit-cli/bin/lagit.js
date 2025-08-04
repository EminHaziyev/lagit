#!/usr/bin/env node
import {Command} from 'commander';
import {initAndlogin} from '../commands/init.js';
import {commit} from '../commands/commit.js';
import {push} from '../commands/push.js';
import {cloneRepo} from '../commands/clone.js';
import {pullRepo} from '../commands/pull.js';
import {create} from '../commands/create.js';
import {deleteRepoApi} from '../commands/delete.js';
import {listReposApi} from '../commands/list-repos.js';


const program = new Command();

program
    .command("init-login <username> <password>")
    .description("initialize a lagit repo and login to your account")
    .action(initAndlogin)

program
    .command("create <repoName>")
    .description("initialize a lagit repo and login to your account")
    .action(create)


program
    .command("commit <message>")
    .description("add a commit message")
    .action(commit)


program
    .command("push")
    .description("push your code to lagit server")
    .action(push)


program
    .command("clone <repoName>")
    .description("push your code to lagit server")
    .action(cloneRepo)

    
program
    .command("pull")
    .description("push your code to lagit server")
    .action(pullRepo)

program
    .command("delete <repoName>")
    .description("push your code to lagit server")
    .action(deleteRepoApi)

program
    .command("list-repos")
    .description("push your code to lagit server")
    .action(listReposApi)

program.parse(process.argv);