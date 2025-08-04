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
    .description("Initialize a lagit repo and login to your account")
    .action(initAndlogin)

program
    .command("create <repoName>")
    .description("Create a new repository in lagit server")
    .action(create)


program
    .command("commit <message>")
    .description("Add a commit message to your repository")
    .action(commit)


program
    .command("push")
    .description("Push your code to lagit server")
    .action(push)


program
    .command("clone <repoName>")
    .description("Clone a repository from lagit server")
    .action(cloneRepo)

    
program
    .command("pull")
    .description("Pull the latest changes from the lagit server")
    .action(pullRepo)

program
    .command("delete <repoName>")
    .description("Delete one of your repositories from lagit server")
    .action(deleteRepoApi)

program
    .command("list-repos")
    .description("List all repositories from lagit server")
    .action(listReposApi)

program.parse(process.argv);