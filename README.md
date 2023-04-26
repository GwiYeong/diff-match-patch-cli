# react-native-bundle-diff-match-patch

CLI tool to generate patch, apply patch, valid patch

## Install

```bash
$ yarn global add diff-match-patch-cli

//or

$ npm install -g diff-match-patch-cli
```

## Usage

### generate patch file

```bash
$ dmp generate old-bundle-path new-bundle-path -o patch-file-name
```

### apply patch file

```bash
$ dmp patch old-file-name patch-file-name
// this will generate a new file with a postfix .patched
$ dmp patch old-file-name patch-file-name -o patched-file-name

$ dmp patch old-file-name patch-file-name -r
// this will replace the old file
```

### check patch file is valid

```bash
$ dmp check-valid patch-file-name
```
