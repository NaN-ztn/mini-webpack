import fs from 'fs';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import path from 'path';
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';
import { jsonLoader } from './jsonLoader.js';
import { SyncHook } from 'tapable';
import { changeOutputPath } from './changeOutputPath.js';
let id = 0;

const webPackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader,
      },
    ],
  },
  plugins: [new changeOutputPath()],
};

const hooks = {
  emitFile: SyncHook(['context']),
};

function createAsset(filePath) {
  let source = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const loaders = webPackConfig.module.rules;
  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      source = use(source);
    }
  });

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

function initPlugins() {
  const plugins = webPackConfig.plugins;
  plugins.forEach((plugin) => {
    plugin.apply(hooks);
  });
}

initPlugins();
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
  let outputPath = './dist/bundle.js';
  const context = {
    changeOutputPath(path) {
      outputPath = path;
    },
  };
  hooks.emitFile.call(context);
  fs.writeFileSync(outputPath, code);
}

build(graph);
