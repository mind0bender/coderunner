import Runner from ".";
import { dirname, join } from "node:path";

class CppRunner extends Runner {
  override binPath: string = "g++";
  override name: string = "cpp";
  override sourceDirPath: string = "./tmp/";
  override fileExtension: string = "cpp";

  override async run(filename: string, code: string): Promise<string> {
    filename = this.sourceDirPath + filename;
    const sourceName: string = await this.writeCode(filename, code);
    const executableName: string = await this.compile(sourceName);
    console.log({ sourceName, executableName });
    console.log(`compiling ${sourceName} to ${executableName} done`);
    const output: string = await this.exec(executableName);
    console.log(output);
    return output;
  }
  override async compile(filename: string): Promise<string> {
    const executableName: string = "." + filename.split(".")[1] || "main";
    const compiler = Bun.spawn([this.binPath, filename, "-o", executableName]);
    await compiler.exited;
    return executableName;
  }
  override async exec(executableName: string): Promise<string> {
    const program = Bun.spawn([
      "nsjail",
      "-Mo",
      "--user",
      "99999",
      "--group",
      "99999",
      "-R",
      "/usr/bin/",
      "-R",
      "/lib",
      "-R",
      "/lib64",
      "-R",
      "/usr/lib",
      "-R",
      join(dirname(Bun.main), ".."),
      "--cwd",
      join(dirname(Bun.main), ".."),
      "--",
      executableName,
    ]);
    await program.exited;
    const output: string = await new Response(program.stdout).text();
    const err: string = await new Response(program.stderr).text();
    console.error(err);
    return output;
  }
}

export default CppRunner;
