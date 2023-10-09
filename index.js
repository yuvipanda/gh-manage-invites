#!/usr/bin/env node
import { Octokit, App, RequestError } from "octokit";
import { program } from "commander";

// Expect PAT set to GITHUB_TOKEN
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

program
  .command("orgs-list")
  .description("List all the orgs the current user is a member of")
  .action(async () => {
    const orgs = await octokit.rest.orgs.listForAuthenticatedUser();
    for (const org of orgs.data) {
      console.log(`${org.login}: ${org.permission}`);
    }
  });

/**
 *
 * @param {string} orgSpec
 */
const parseOrgSpec = async (orgSpec) => {
  const parts = orgSpec.split(":");
  if (parts.length === 1) {
    return {
      org: orgSpec,
    };
  } else if (parts.length === 2) {
    const [org, team] = parts;
    const teamInfo = await octokit.rest.teams.getByName({
      org: org,
      team_slug: team,
    });
    return {
      org: org,
      team_id: [teamInfo.data.id],
    };
  }
};

program
  .command("invite")
  .description("Invite users to an organization")
  .argument("organization", "Name of GitHub organization to invite users to")
  .argument("<usernames...>", "List of GitHub usernames to invite")
  .action(async (organization, usernames) => {
    const inviteTargetInfo = await parseOrgSpec(organization);
    console.log(inviteTargetInfo);
    let missingUsers = [];
    let userIDs = new Map();
    for (const username of usernames) {
      try {
        const userInfo = await octokit.rest.users.getByUsername({
          username: username,
        });
        userIDs.set(username, userInfo.data.id);
      } catch (e) {
        if (e instanceof RequestError) {
          if (e.status === 404) {
            missingUsers.push(username);
            continue;
          }
        }
        throw e;
      }
    }

    if (missingUsers.length !== 0) {
      // Some usernames don't exist, let's error out early so user can fix that
      console.log(
        `The following ${
          missingUsers.length
        } user(s) were not found on GitHub: ${missingUsers.join(" ")}`
      );
      console.log("Fix the usernames and try again");
      process.exit(1);
    }

    // We now know all these users exist!

    for (const [username, userid] of userIDs.entries()) {
      //   return
      try {
        await octokit.rest.orgs.createInvitation({
          ...inviteTargetInfo,
          invitee_id: userid,
        });
        console.log(`${username} invited`);
      } catch (e) {
        if (e instanceof RequestError) {
          // FIXME: Handle multiple errors?
          console.log(e.response.data);
          const error = e.response.data.errors[0];
          switch (error.message) {
            case "Invitee is already a part of this organization":
              console.log(`${username} already a member, skipped`);
              break;
            default:
              throw e;
          }
        } else {
          throw e;
        }
      }
    }
  });

program.command('list-pending-invites')
.argument('organization').action(async (organization) => {
  const invitations = await octokit.rest.orgs.listPendingInvitations({
    org: organization
  });
  console.log(invitations);
});
await program.parseAsync();
