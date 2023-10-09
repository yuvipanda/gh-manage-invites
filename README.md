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

## Usage

You need a recent enough version of [nodejs](https://nodejs.org/en) installed first.

After that, the recommended way to use this is via the [npx](https://www.npmjs.com/package/npx)
mechanism.




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