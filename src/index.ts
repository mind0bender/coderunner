import CppRunner from "./core/runner/cpprunner";
import { PORT } from "utils/const";
import homepage from "./public/index.html";

const cppRunner: CppRunner = new CppRunner();

const server = Bun.serve({
  port: PORT,
  routes: {
    "/cpp": async (req: Request): Promise<Response> => {
      const url = new URL(req.url);
      const code: string = url.searchParams.get("code") || "";
      console.log(code);
      const output: string = await cppRunner.run(code);
      return new Response(
        JSON.stringify({
          output,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
    "/": homepage,
  },
  development: true,
});

console.log(`listening on ${server.url}`);

