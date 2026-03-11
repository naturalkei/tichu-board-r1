import fs from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'
import { __unstable__loadDesignSystem } from '@tailwindcss/node'

const projectRoot = process.cwd()
const srcRoot = path.join(projectRoot, 'src')
const cssPath = path.join(srcRoot, 'index.css')
const calleeFunctions = new Set(['clsx', 'cn', 'classNames', 'twMerge', 'cva'])

const cssContent = await fs.readFile(cssPath, 'utf8')
const designSystem = await __unstable__loadDesignSystem(cssContent, { base: srcRoot })

const findings = []

for (const filePath of await collectTsxFiles(srcRoot)) {
  const sourceText = await fs.readFile(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  walk(sourceFile, (node) => {
    if (ts.isJsxAttribute(node) && isClassAttribute(node.name)) {
      inspectInitializer(node.initializer, sourceFile, filePath)
    }
  })
}

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(
      `${path.relative(projectRoot, finding.filePath)}:${finding.line}:${finding.column} ` +
        `The class \`${finding.original}\` can be written as \`${finding.canonical}\``,
    )
  }

  process.exitCode = 1
}

function inspectInitializer(initializer, sourceFile, filePath) {
  if (!initializer) {
    return
  }

  if (ts.isStringLiteral(initializer)) {
    inspectClassList(initializer.text, initializer, sourceFile, filePath)
    return
  }

  if (!ts.isJsxExpression(initializer) || !initializer.expression) {
    return
  }

  inspectExpression(initializer.expression, sourceFile, filePath)
}

function inspectExpression(expression, sourceFile, filePath) {
  if (ts.isStringLiteralLike(expression)) {
    inspectClassList(expression.text, expression, sourceFile, filePath)
    return
  }

  if (ts.isTemplateExpression(expression)) {
    inspectTemplateSpan(expression.head, sourceFile, filePath)
    for (const span of expression.templateSpans) {
      inspectExpression(span.expression, sourceFile, filePath)
      inspectTemplateSpan(span.literal, sourceFile, filePath)
    }
    return
  }

  if (ts.isConditionalExpression(expression)) {
    inspectExpression(expression.whenTrue, sourceFile, filePath)
    inspectExpression(expression.whenFalse, sourceFile, filePath)
    return
  }

  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
    inspectExpression(expression.right, sourceFile, filePath)
    return
  }

  if (ts.isCallExpression(expression) && getCalleeName(expression.expression)) {
    for (const argument of expression.arguments) {
      inspectCallArgument(argument, sourceFile, filePath)
    }
  }
}

function inspectCallArgument(argument, sourceFile, filePath) {
  if (ts.isStringLiteralLike(argument)) {
    inspectClassList(argument.text, argument, sourceFile, filePath)
    return
  }

  if (ts.isTemplateExpression(argument)) {
    inspectTemplateSpan(argument.head, sourceFile, filePath)
    for (const span of argument.templateSpans) {
      inspectExpression(span.expression, sourceFile, filePath)
      inspectTemplateSpan(span.literal, sourceFile, filePath)
    }
    return
  }

  if (ts.isArrayLiteralExpression(argument)) {
    for (const element of argument.elements) {
      inspectCallArgument(element, sourceFile, filePath)
    }
    return
  }

  if (ts.isObjectLiteralExpression(argument)) {
    for (const property of argument.properties) {
      if (ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.name)) {
        inspectClassList(property.name.text, property.name, sourceFile, filePath)
      }
    }
    return
  }

  if (ts.isConditionalExpression(argument)) {
    inspectExpression(argument.whenTrue, sourceFile, filePath)
    inspectExpression(argument.whenFalse, sourceFile, filePath)
  }
}

function inspectTemplateSpan(span, sourceFile, filePath) {
  const tokens = span.text.match(/\S+/g) ?? []

  for (const token of tokens) {
    reportIfNonCanonical(token, span, sourceFile, filePath)
  }
}

function inspectClassList(classList, node, sourceFile, filePath) {
  const tokens = classList.match(/\S+/g) ?? []

  for (const token of tokens) {
    reportIfNonCanonical(token, node, sourceFile, filePath)
  }
}

function reportIfNonCanonical(token, node, sourceFile, filePath) {
  if (!looksLikeTailwindClass(token)) {
    return
  }

  const canonical = designSystem.canonicalizeCandidates([token], { rem: 16 })[0]

  if (!canonical || canonical === token) {
    return
  }

  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))

  findings.push({
    filePath,
    line: line + 1,
    column: character + 1,
    original: token,
    canonical,
  })
}

function isClassAttribute(name) {
  return ts.isIdentifier(name) && (name.text === 'class' || name.text === 'className')
}

function getCalleeName(expression) {
  if (!ts.isIdentifier(expression)) {
    return null
  }

  return calleeFunctions.has(expression.text) ? expression.text : null
}

function looksLikeTailwindClass(token) {
  return /[-:[\]()/]/.test(token)
}

async function collectTsxFiles(directoryPath) {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true })
  const filePaths = await Promise.all(
    directoryEntries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name)

      if (entry.isDirectory()) {
        return collectTsxFiles(entryPath)
      }

      return entry.isFile() && entry.name.endsWith('.tsx') ? [entryPath] : []
    }),
  )

  return filePaths.flat()
}

function walk(node, visit) {
  visit(node)
  ts.forEachChild(node, (child) => walk(child, visit))
}
