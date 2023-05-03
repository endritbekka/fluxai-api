import { CatchExceptionCallback } from "../../lib/types";

class GeneralHelper {
  static async catchException<T>(
    callback: CatchExceptionCallback<T>
  ): Promise<[T | undefined, Error | unknown]> {
    try {
      const result = await Promise.resolve(callback());
      return [result, undefined];
    } catch (error) {
      return [undefined, error];
    }
  }
  static withoutKeys<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  }
}

export default GeneralHelper;
