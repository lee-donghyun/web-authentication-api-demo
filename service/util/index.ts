const getRandom = (min: number, max: number) => {
  if (!(max > min)) {
    throw new Error("max must greater than min");
  }
  const diff = max - min;
  return Math.random() * diff + min;
};

export const getBuffer = () => {
  const array = new Uint8Array(
    Array(8)
      .fill(0)
      .map(() => getRandom(0, 255))
  );
  console.log({ array });

  return array.buffer;
};
