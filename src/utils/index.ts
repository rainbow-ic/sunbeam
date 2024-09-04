export type Response<T, E> =
    | {
          ok: T;
      }
    | {
          err: E;
      };
export const parseOptionResponse = <T, E>(response: Response<T, E>): T => {
    if ("ok" in response) {
        return response.ok;
    } else {
        throw new Error(JSON.stringify(response.err));
    }
};
