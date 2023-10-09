import { Octokit, RequestError } from "octokit";
/**
 *
 * @param {string} orgSpec
 */
async function parseOrgSpec(orgSpec) {
  const parts = orgSpec.split(":");
  if (parts.length === 1) {
    return {
      org: orgSpec,
    };
  } else if (parts.length === 2) {
    const [org, team] = parts;
    return {
      org: org,
      team_id: [teamInfo.data.id],
    };
  }
}

/**
 *
 * @param {Octokit} octokit
 * @param {string} organization An organization name or an organization:team name
 * @param {[Array<string]} teams
 * @param {Array<string>} usernames
 */
export async function inviteUsers(octokit, organization, teams, usernames) {
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

  let teamIDs = [];
  let missingTeams = [];
  if (teams && teams.length !== 0) {
    for (const teamSlug of teams) {
      try {
        const teamInfo = await octokit.rest.teams.getByName({
          org: organization,
          team_slug: teamSlug,
        });
        teamIDs.push(teamInfo.data.id);
      } catch (e) {
        if (e instanceof RequestError) {
          if (e.status === 404) {
            missingTeams.push(teamSlug);
            continue;
          }
        }
        throw e;
      }
    }
  }

  if (missingTeams.length !== 0) {
    // Some teams don't exist, let's error out early so user can fix that
    console.log(
      `The following ${
        missingTeams.length
      } team(s) were not found on the GitHub org ${organization}: ${missingTeams.join(
        " "
      )}`
    );
    console.log("Fix the team names and try again");
    process.exit(1);
  }

  // We now know all these users exist!

  for (const [username, userid] of userIDs.entries()) {
    //   return
    try {
      await octokit.rest.orgs.createInvitation({
        org: organization,
        team_ids: teamIDs,
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
}
