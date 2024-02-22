// Based off of: https://www.huy.rocks/everyday/02-14-2022-typescript-implement-rust-style-result
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data };
};

export const err = <E>(error: E): Result<never, E> => {
  return { ok: false, error };
};
