# gh-manage-invites

Manage invites to GH organizations in bulk.

## Why?

While this is useful for many, many reasons, the driving pupose was to be used with
JupyterHub. Particularly, when using [OAuthenticator](https://github.com/jupyterhub/oauthenticator)
to allow users to authenticate to your JupyterHub via GitHub, you might want to allow only
users from a specific team or github organization to login. But inviting *many* users with
the GitHub web ui can be cumbersome, hence this commandline tool.

While this is not an official [2i2c](https://2i2c.org) project, it was inspired by [this specific
request](https://github.com/2i2c-org/infrastructure/issues/3240#issuecomment-1751171379) by
[@erinmr](https://github.com/erinmr).

## Installation

You need a recent enough version of [nodejs](https://nodejs.org/en) installed first.

After that, the recommended way to use this is via the [npx](https://www.npmjs.com/package/npx)
mechanism. It'll automatically install the package if needed.

```
➜ npx gh-managed-invites
Usage: gh-manage-invites [options] [command]

Manage bulk invitations to GitHub Organizations

Options:
  -h, --help                                      display help for command

Commands:
  invite [options] <organization> <usernames...>  Invite users to an organization
  list-pending-invites <organization>             List unaccepted invitations for a given organization
  help [command]                                  display help for command
```

## Usage

### Create a GitHub Personal Access Token

This tool will perform actions as you on GitHub, and so you need to create a
GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)

1. Go to [Personal Access Tokens (classic)](https://github.com/settings/tokens). I have not
   tested this with 'fine grained tokens' yet, so we would need to use classic tokens.
2. Click "Generate New Token" and then select "Generate New Token (classic)" from the dropdown.
3. Give it a descriptive name, and select an appropriate expiry date. If you are planning on doing
   just a single round of mass invitations, I recommend selecting the smallest validity time
   possible (7 days). Having these tokens lying around can be dangerous.
4. Select the `admin:org` privilege, so the token can create invitations to the organizations you
   are an admin of.
5. Click "Generate Token"
6. The token will be visible *only this time* - after you navigate away from this page, the token
   will no longer be visible!
7. Specify it as an environment variable in your terminal

   ```bash
   export GITHUB_TOKEN=<token>
   ```

Now you're all set up to use this tool!

### Inviting many users to an organization

The `invite` command does most of the work of this tool.

```bash
➜ npx gh-manage-invites invite --help
Usage: gh-manage-invites invite [options] <organization> <usernames...>

Invite users to an organization

Arguments:
  organization           Name of GitHub organization to invite users to
  usernames              List of GitHub usernames to invite

Options:
  -t, --team [teams...]  Slugs of GitHub Teams to automatically add these users to once
                         they accept invite
  -h, --help             display help for command

```

If you want to invite users `yuvipanda` and `erinmr` to the organization `2i2c-imagebuilding-hub-access`,
you would run the following

```bash
➜ npx gh-manage-invites invite 2i2c-imagebuilding-hub-access yuvipanda erinmr
yuvipanda already a member, skipped
erinmr invited
```

Users who are already members of the organization are ignored, and others get an invite sent!

If you want the users to be automatically added to a *specific team* after they accept the invite,
you can pass that via the `--team` argument. This can be passed many times, and should be the
*team slug*, which you can find out from looking at the URL of the team page in the org.
For example, if the team page is at `https://github.com/orgs/2i2c-imagebuilding-hub-access/teams/test-3`,
the slug is the last component of the URL - and hence, `test-3`.

```bash
➜ npx gh-manage-invites invite 2i2c-imagebuilding-hub-access yuvipanda erinmr --team test-3 --team test-1
yuvipanda already a member, skipped
erinmr invited
```

And if your list of usernames is in a file, say `user-list.txt`, one github username per line,
you can run:

```bash
➜ npx gh-manage-invites invite  2i2c-imagebuilding-hub-access $(cat user-list.txt) --team test-2
yuvipanda already a member, skipped
erinmr invited
```

This allows for true bulk imports!

### Listing unaccepted invites

GitHub user invites are by default valid for 7 days, and the user must explicitly accept
them to become part of the org. This tool also provides an easy way to look at all yet-to-be accepted
invites.

```bash
➜  npx gh-manage-invites  list-pending-invites 2i2c-imagebuilding-hub-access
erinmr pending since today at 9:36 PM
test1 pending since today at 11:08 PM
test2 pending since today at 11:08 PM
```

You can reach out to the users who haven't accepted the invite and gently nudge them until
they do.

## But... why JavaScript?

Most of the JupyterHub ecosystem tooling is in python, why is this written in Javascript?

As a child, I started writing code that others found useful 'for fun'. As an
adult, I'm very privileged to be able to write code for causes I care about, in
community with people who treat me well, *and* get paid for it! This is awesome!
In therapy, we have discovered it is still quite important to do things
'just for fun'. Writing code that's not actually useful to anyone doesn't feel like 'fun'
to me, but I also wanted to experience the feeling of 'hey, something new!'. Hence, am trying
out writing things that people will find useful in languages *other than python*, purely for fun.
Let's see how this goes.

Oh, and this is also why this project is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html).
Given the commandline nature of this project, it should have 0 actual impact on any users. But maybe
the newness of it will give me a dopamine hit!