import fs from 'fs';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import path, { relative } from 'path';
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';
let id = 0;

function createAsset(filePath) {
  const source = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parser.parse(source, { sourceType: 'module' });
  let deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });
  return {
    code,
    filePath,
    deps,
    id: ++id,
    mapping: {},
  };
}

function createGraph(filePath) {
  const mainAsset = createAsset(filePath);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.deps.forEach((childPath) => {
      const child = createAsset(path.resolve('./example', childPath));
      asset.mapping[childPath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}

const graph = createGraph('./example/main.js');

function build(graph) {
  const template = fs.readFileSync('./boundle.ejs', { encoding: 'utf-8' });
  const data = graph.map(({ id, code, mapping }) => {
    return {
      id,
      code,
      mapping,
    };
  });
  const code = ejs.render(template, { data });
  fs.writeFileSync('./dist/bundle.js', code);
}

build(graph);
