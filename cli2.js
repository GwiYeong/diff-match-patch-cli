const { resolve, basename } = require('path')
const { fs } = require('mz')
const invariant = require('invariant')
const DMP = require('diff-match-patch')
const cwd = process.cwd()
const findFile = (path) => resolve(cwd, path)

const checkFileIsExisted = async (path) => {
  invariant(await fs.exists(path), `File：${path} is not found`)
  return fs.readFile(path, 'utf8')
}

exports.generatePatch = async (oldFilePath, newFilePath, opt) => {
  const dmp = new DMP()
  const oldFileName = findFile(oldFilePath)
  console.log('From:', oldFileName)
  const newFileName = findFile(newFilePath)
  console.log('Diff:', newFileName)
  const oldFile = await checkFileIsExisted(oldFileName)
  const newFile = await checkFileIsExisted(newFileName)
  const patchFileName = resolve(cwd, opt.output || `${basename(oldFilePath)}-${basename(newFilePath)}.patch`)
  console.log('Patch:', patchFileName)
  const patchArr = dmp.patch_make(oldFile, newFile)
  await fs.writeFile(patchFileName, dmp.patch_toText(patchArr), 'utf8')
}

exports.patchFile = async (fileToPatch, patchFilePath, opt) => {
  const dmp = new DMP()
  const patchTarget = findFile(fileToPatch)
  console.log('Target:', patchTarget)
  const targetContent = await checkFileIsExisted(patchTarget)
  const patchFileName = findFile(patchFilePath)
  console.log('Patch:', patchFileName)
  const patchContent = await checkFileIsExisted(patchFileName)
  const patchArr = dmp.patch_fromText(patchContent)
  const patchedFile = opt.replace ? patchTarget : `${patchTarget}.patched`
  console.log('Patched:', resolve(cwd, patchedFile))
  await fs.writeFile(resolve(cwd, patchedFile), dmp.patch_apply(patchArr, targetContent)[0], 'utf8')
}

exports.checkPatchValid = async (patchFilePath) => {
  const dmp = new DMP()
  const patchFullPath = findFile(patchFilePath)
  const patchContent = await fs.readFile(patchFullPath, 'utf8')
  try {
    dmp.patch_fromText(patchContent)
    console.log('Patchfile is valid')
  } catch (e) {
    console.error('Patchfile is not valid for：', e.message)
    process.exit(1)
  }
}
