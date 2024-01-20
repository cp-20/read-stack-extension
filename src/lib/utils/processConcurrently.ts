export const processConcurrently = async <T>(
  functions: (() => Promise<T>)[],
  parallel: number,
  doneCallback?: (result: T) => void,
) => {
  const funcs = [...functions];
  const result: T[] = [];

  const addQueue = async () => {
    const func = funcs.shift();
    if (!func) return;

    const res = await func();
    result.push(res);
    doneCallback?.(res);

    if (funcs.length > 0) await addQueue();
  };

  await Promise.all([...Array(parallel)].map(() => addQueue()));

  return result;
};
