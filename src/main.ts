import * as core from '@actions/core'
import {deletePackages} from './github'

async function run(): Promise<void> {
  console.log('run action')
  try {
    const githubToken = core.getInput('github_token')
    const owner = core.getInput('owner')
    const username = core.getInput('username')
    const repo = core.getInput('repo')
    const packages = core.getMultilineInput('packages')
    const semVerPattern = core.getInput('max_semver_pattern')
    const dryRun = core.getBooleanInput('dry_run')

    await deletePackages({
      githubToken,
      owner,
      username,
      repo,
      packages,
      semVerPattern,
      dryRun
    })

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core.setFailed(error.message)
  }
}

run()
