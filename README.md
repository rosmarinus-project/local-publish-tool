# @rosmarinus/local-publish-tool

This is an npm package publishing tool, and finally triggers github actions through push tag.

This npm is convenient for self-publishing and encapsulates the following publishing process:
1. Change the version number locally
2. Run single test locally
3. Tag and push to remote end
4. git actions release

# How to Install

```bash
npm i @rosmarinus/local-publish-tool -D
```

# How To Publish With It
```bash
rosmarinus-publish
```