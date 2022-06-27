import {
  build,
  emptyDir,
  ShimOptions,
} from "https://deno.land/x/dnt@0.23.0/mod.ts";

const [name, version] = Deno.args,
  shims: ShimOptions = {
    custom: [
      {
        package: {
          name: "@insertish/isomorphic-ws",
          version: "~4.0.1",
        },
        globalNames: [
          {
            name: "WebSocket",
            exportName: "default",
          },
        ],
      },
      {
        package: {
          name: "eventemitter3",
          version: "~4.0.7",
        },
        globalNames: [
          {
            name: "EventEmitter",
            exportName: "default",
          },
        ],
      },
    ],
  },
  devDependencies: Record<string, string> = {},
  dependencies: Record<string, string> = {};

if (!name || !["rest", "utils", "client"].includes(name)) {
  console.log("Invalid module name");
  Deno.exit(1);
}

if (!version) {
  console.log("Missing version");
  Deno.exit(1);
}

await emptyDir(`./modules/${name}/npm`);

devDependencies["@types/node"] = "16.x";
devDependencies["@types/ws"] = "8.5.3";
devDependencies["@types/eventemitter3"] = "2.0.2";
dependencies["ws"] = "8.8.0";

await build({
  packageManager: "pnpm",
  scriptModule: false,
  test: false,
  entryPoints: [`./modules/${name}/mod.ts`],
  outDir: `./modules/${name}/npm`,
  shims,

  package: {
    name: `@itchatapp/${name}`,
    version: Deno.args[0].replace(/[A-Z]+/gi, ""),
    description: `${name} module for itchat.js`,
    devDependencies,
    dependencies,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/itchatapp/itchat.js.git",
    },
    bugs: {
      url: "https://github.com/itchatapp/itchat.js/issues",
    },
    engines: {
      node: ">=16.0.0",
    },
    files: ["esm/*", "types/*"],
  },
});

Deno.copyFileSync("LICENSE", `modules/${name}/npm/LICENSE`);
Deno.copyFileSync("README.md", `modules/${name}/npm/README.md`);
