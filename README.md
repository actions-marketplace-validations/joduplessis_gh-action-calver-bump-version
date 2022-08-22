## gh-action-calver-bump-version

GitHub Action for automated CalVer version bumps for NPM.

> ⚠️ Make sure you use the `actions/checkout@v2` action

### Usage:

#### Prefix tag
```yaml
- name:  'Bump CalVer version'
  uses:  'joduplessis/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag-prefix:  'v'
```

#### Skip tagging
```yaml
- name:  'Bump CalVer version'
  uses:  'joduplessis/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    skip-tag:  'true'
```

#### package.json folder
```yaml
- name:  'Bump CalVer version'
  uses:  'joduplessis/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    PACKAGEJSON_DIR:  'frontend'
```

#### Target branch
```yaml
- name:  'Bump CalVer version'
  uses:  'joduplessis/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    target-branch: 'feature'
```

#### Commit message
```yaml
- name:  'Bump CalVer version'
  uses:  'joduplessis/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    commit-message: 'Version bump to {{version}}'
```

Adapted from the excellent [Automated Version Bump](https://github.com/marketplace/actions/automated-version-bump)
