#!/usr/bin/env node
import { Octokit, RequestError } from "octokit";
import { program } from "commander";
import { inviteUsers } from "./invite.js";
import { formatRelative } from "date-fns";

// Expect PAT set to GITHUB_TOKEN
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

program.description("Manage bulk invitations to GitHub Organizations");

program
  .command("invite")
  .description("Invite users to an organization")
  .option(
    "-t, --team [teams...]",
    "Slugs of GitHub Teams to automatically add these users to once they accept invite"
  )
  .argument("organization", "Name of GitHub organization to invite users to")
  .argument("<usernames...>", "List of GitHub usernames to invite")
  .action((organization, usernames, options) => {
    return inviteUsers(octokit, organization, options.team, usernames);
  });

program
  .command("list-pending-invites")
  .description("List unaccepted invitations for a given organization")
  .argument(
    "organization",
    "Name of github organization to list pending invites for"
  )
  .action(async (organization) => {
    const invitations = await octokit.rest.orgs.listPendingInvitations({
      org: organization,
    });
    for (const invite of invitations.data) {
      const since = Date.parse(invite.created_at);
      console.log(`${invite.login} pending since ${formatRelative(since, new Date())}`);
    }
  });
await program.parseAsync();
