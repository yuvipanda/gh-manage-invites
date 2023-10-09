#!/usr/bin/env node
import { Octokit, RequestError } from "octokit";
import { program } from "commander";
import { inviteUsers } from "./invite.js";

// Expect PAT set to GITHUB_TOKEN
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

program
  .command("invite")
  .description("Invite users to an organization")
  .option('-t, --team [teams...]', 'Slugs of GitHub Teams to automatically add these users to once they accept invite')
  .argument("organization", "Name of GitHub organization to invite users to")
  .argument("<usernames...>", "List of GitHub usernames to invite")
  .action((organization, usernames, options) =>
    {
      return inviteUsers(octokit, organization, options.team, usernames)
    }
  );

program
  .command("list-pending-invites")
  .argument(
    "organization",
    "Name of github organization to list pending invites for"
  )
  .action(async (organization) => {
    const invitations = await octokit.rest.orgs.listPendingInvitations({
      org: organization,
    });
    console.log(invitations);
  });
await program.parseAsync();
