export function asyncRetry<T, U extends unknown[]>(
  fn: (...args: U) => Promise<T>,
  options?: {
    retries?: number;
    onFail?: (err: Error) => void;
    thisArg?: ThisType<unknown> | null;
  }
): (...args: U) => Promise<T> {
  const errors: Error[] = [];
  let result: T;
  let resolved = false;
  const defaultRetries = 5;
  let { retries = defaultRetries } = options || {};
  const { onFail = () => null, thisArg = null } = options || {};
  return async function (...args: U): Promise<T> {
    while (retries > 0 && !resolved) {
      retries--;
      try {
        result = await fn.call(thisArg, ...args);
        resolved = true;
      } catch (e) {
        onFail(e as Error);
        errors.push(e as Error);
      }
    }
    if (resolved) {
      return Promise.resolve(result);
    }
    const error: Error & {
      errors?: string[];
    } = new Error(
      `Failed to resolve fn after ${
        options?.retries || defaultRetries
      } retries.`
    );
    error.errors = errors.map((e) => e.message);
    return Promise.reject(error);
  };
}
