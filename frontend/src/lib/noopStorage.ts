export const noopStorage = () => {
  return {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => {},
    removeItem: async (_key: string) => {},
  };
};
