import bcrypt from "bcrypt";

class Bcrypt {
  private saltRounds = 10;

  public async hash(input: string | Buffer) {
    return await bcrypt.hash(input, this.saltRounds);
  }

  public async compare(data: string | Buffer, encrypted: string) {
    return await bcrypt.compare(data, encrypted);
  }
}

export default new Bcrypt();
