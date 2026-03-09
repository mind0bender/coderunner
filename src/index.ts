import CppRunner from "./core/runner/cpprunner";
import { PORT } from "utils/const";
import homepage from "./public/index.html";
import type Runner from "./core/runner";
import { spawn } from "bun";

const cppRunner: CppRunner = new CppRunner();

async function run(cmd: string[], cwd: string): Promise<string> {
  console.log({ cwd });
  const p = spawn(cmd, {
    cwd,
  });
  const o: string = await p.stdout.text();
  await p.exited;
  return o;
}

const server = Bun.serve({
  port: PORT,
  routes: {
    "/": homepage,
    "/run": async (req: Request): Promise<Response> => {
      const url: URL = new URL(req.url);
      const cmd: string = url.searchParams.get("code") || "";
      const cwd: string = url.searchParams.get("cwd") || "";
      if (!cmd)
        return new Response("no command", {
          headers: {
            "Content-Type": "text/plain",
          },
        });

      try {
        const o: string = await run(cmd.split(" "), cwd);
        console.log({ o });
        return new Response(o, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          return new Response(e.message, {
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }
        return new Response("Error", {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
    },
    "/cpp": async (req: Request): Promise<Response> => {
      const url: URL = new URL(req.url);
      const code: string = url.searchParams.get("code") || "";
      const output: string = await cppRunner.run("main", code);
      return new Response(output, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
  },
  development: true,
});

console.log(`listening on ${server.url}`);
