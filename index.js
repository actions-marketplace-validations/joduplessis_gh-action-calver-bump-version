const { Toolkit } = require('actions-toolkit')
const { execSync } = require('child_process')

// Change working directory if user defined PACKAGEJSON_DIR
if (process.env.PACKAGEJSON_DIR) {
    process.env.GITHUB_WORKSPACE = `${process.env.GITHUB_WORKSPACE}/${process.env.PACKAGEJSON_DIR}`
    process.chdir(process.env.GITHUB_WORKSPACE)
}

// Run your GitHub Action!
Toolkit.run(async (tools) => {
    try {
        const pkg = tools.getPackageJSON()
        const tagPrefix = process.env['INPUT_TAG-PREFIX'] || ''
        const commitMessage = process.env['INPUT_COMMIT-MESSAGE'] || 'ci: version bump to {{version}}'
        const current = pkg.version.toString()
        const currentVersionParts = current.split('-')
        const calVersion = currentVersionParts[0]
        const patchVersion = currentVersionParts[1]
        const bumpedPatchVersion = patchVersion ? Number(patchVersion) + 1 : 0
        const newVersion = calVersion + '-' + bumpedPatchVersion
        let currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF)[1]
        let isPullRequest = false

        console.log('currentBranch:', currentBranch)
        console.log('current:', current, '/', 'new version:', newVersion)
        console.log(commitMessage.replace(/{{version}}/g, newVersion))

        // set git user
        await tools.runInWorkspace('git', [
            'config',
            'user.name',
            `"${process.env.GITHUB_USER || 'Automated Version Bump'}"`,
        ])

        await tools.runInWorkspace('git', [
            'config',
            'user.email',
            `"${process.env.GITHUB_EMAIL || 'gh-action-calver-bump-version@users.noreply.github.com'}"`,
        ])

        if (process.env.GITHUB_HEAD_REF) {
            currentBranch = process.env.GITHUB_HEAD_REF
            isPullRequest = true
        }

        if (process.env['INPUT_TARGET-BRANCH']) {
            currentBranch = process.env['INPUT_TARGET-BRANCH']
        }

        await tools.runInWorkspace('npm', ['version', '--allow-same-version=true', '--git-tag-version=false', current])
        await tools.runInWorkspace('git', ['commit', '-a', '-m', '"test commit"'])

        // now go to the actual branch to perform the same versioning
        if (isPullRequest) {
            await tools.runInWorkspace('git', ['fetch'])
        }

        await tools.runInWorkspace('git', ['checkout', currentBranch])
        await tools.runInWorkspace('npm', ['version', '--allow-same-version=true', '--git-tag-version=false', current])

        try {
            // to support "actions/checkout@v1"
            await tools.runInWorkspace('git', ['commit', '-a', '-m', commitMessage.replace(/{{version}}/g, newVersion)])
        } catch (e) {
            console.warn(
                'git commit failed because you are using "actions/checkout@v2"; ' +
                    'but that doesnt matter because you dont need that git commit, thats only for "actions/checkout@v1"'
            )
        }

        const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`

        if (process.env['INPUT_SKIP-TAG'] !== 'true') {
            await tools.runInWorkspace('git', ['tag', tagPrefix + newVersion])
            await tools.runInWorkspace('git', ['push', remoteRepo, '--follow-tags'])
            await tools.runInWorkspace('git', ['push', remoteRepo, '--tags'])
        } else {
            await tools.runInWorkspace('git', ['push', remoteRepo])
        }
    } catch (e) {
        console.log(e)
        tools.log.fatal(e)
        tools.exit.failure('Failed to bump version')
    }
    tools.exit.success('Version bumped!')
})
