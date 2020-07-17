import * as bcrypt from "bcryptjs";

export default class HashManager {
  public async hash(s: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_COST);
    const salt = await bcrypt.genSalt(rounds);
    const cipherText = await bcrypt.hash(s, salt);

    return cipherText;
  }

  public async compare(s: string, hash: string): Promise<boolean> {
    return bcrypt.compare(s, hash);
  }
}
