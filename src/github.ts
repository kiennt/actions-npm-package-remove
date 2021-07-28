import {Octokit} from '@octokit/rest'
import semver from 'semver'

type OctokitParams = {
  githubToken: string
  owner: string
  repo: string
  packages: Array<string>
  semVerPattern: string
  dryRun: boolean
}

type DeleteVersion = {id: number; name: string}

const listAllVersionForAPackageWillBeDeleted = async (
  params: OctokitParams
): Promise<Record<string, DeleteVersion[]>> => {
  const octokit = new Octokit({auth: params.githubToken})

  const promiseResolver = params.packages.map(async (pkg: string) => {
    try {
      const data = await octokit.paginate(
        octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg,
        {
          package_type: 'npm',
          org: params.owner,
          package_name: pkg,
          per_page: 30
        },
        resp => resp.data
      )
      return data
        .map<DeleteVersion>(d => ({id: d.id, name: d.name}))
        .filter(({name}) => {
          return semver.lte(name, params.semVerPattern)
        })
    } catch (e) {
      return []
    }
  })
  const resp = await Promise.all(promiseResolver)
  return params.packages.reduce((acc, k, idx) => {
    acc[k] = resp[idx]
    return acc
  }, {} as Record<string, DeleteVersion[]>)
}

export const deletePackages = async (params: OctokitParams): Promise<void> => {
  const octokit = new Octokit({auth: params.githubToken})
  const packages = await listAllVersionForAPackageWillBeDeleted(params)
  if (params.dryRun) {
    Object.keys(packages).forEach(pkgName => {
      console.log(`delete package ${pkgName}`)
      console.log(packages[pkgName])
    })
    return
  }
  const patchDelete = Object.keys(packages).map(pkgName => {
    return packages[pkgName].map(async version => {
      return octokit.packages.deletePackageVersionForOrg({
        package_type: 'npm',
        package_version_id: version.id,
        package_name: pkgName,
        org: params.owner
      })
    })
  })
  await Promise.all(patchDelete)
}
