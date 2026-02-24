import CppRunner from "./core/runner/cpprunner";
import { PORT } from "utils/const";
import homepage from "./public/index.html";
import type Runner from "./core/runner";

const cppRunner: CppRunner = new CppRunner();

const server = Bun.serve({
  port: PORT,
  routes: {
    "/cpp": async (req: Request): Promise<Response> => {
      const url = new URL(req.url);
      const code: string = url.searchParams.get("code") || "";
      const output: string = await cppRunner.run(code);
      return new Response(output, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
    "/": homepage,
  },
  development: true,
});

console.log(`listening on ${server.url}`);

