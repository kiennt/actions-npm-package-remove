import {deletePackages} from '../src/github'

jest.setTimeout(30000)

describe('test', () => {
  it('should return true', () => {
    expect(1).toEqual(1)
  })

  it('should delete packages', async () => {
    await deletePackages({
      githubToken: '',
      username: 'hoangviet',
      repo: 'tiki-miniapp',
      packages: ['tf-miniapp', 'tf-miniapp-core'],
      semVerPattern: '1.75.0',
      dryRun: true
    })
  })
})
