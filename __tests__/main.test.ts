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
      packages: ['tf-miniapp'],
      semVerPattern: '1.44.0',
      dryRun: false
    })
  })
})
