abstract class Runner {
  abstract binPath: string;
  abstract name: string;
  abstract sourceDirPath: string;
  abstract fileExtension: string;
  async run(filename: string, code: string): Promise<string> {
    filename = this.sourceDirPath + filename;
    const sourceName: string = await this.writeCode(filename, code);
    const executableName: string = await this.compile(filename);
    const output: string = await this.exec(executableName);
    console.log(output);
    return output;
  }
  async compile(filename: string): Promise<string> {
    const executableName: string = "." + filename.split(".")[1] || "test";
    const compiler = Bun.spawn([this.binPath, filename, "-o", executableName]);
    await compiler.exited;
    return executableName;
  }
  async exec(executableName: string): Promise<string> {
    const program = Bun.spawn([executableName]);
    await program.exited;
    const output: string = await new Response(program.stdout).text();
    const err: string = await new Response(program.stderr).text();
    console.error(err);
    return output;
  }
  protected async writeCode(filename: string, code: string): Promise<string> {
    const sourceName = filename + "." + this.fileExtension;
    console.log(`writing to ${sourceName}`);
    console.log({ sourceName, code });
    await Bun.write(sourceName, code);
    console.log(`writing to ${sourceName} done`);
    return sourceName;
  }
}

export default Runner;
