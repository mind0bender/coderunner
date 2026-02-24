import Runner from ".";

class CppRunner extends Runner {
  override binPath: string = "g++";
  override name: string = "cpp";
  override sourceDirPath: string = "./tmp/";
  override fileExtension: string = "cpp";

  override async run(code: string): Promise<string> {
    return super.run("test.cpp", code);
  }
}

export default CppRunner;
