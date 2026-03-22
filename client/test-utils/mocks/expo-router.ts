export const push = jest.fn();
export const replace = jest.fn();
export const back = jest.fn();

export const router = {
  push,
  replace,
  back,
};

export const useRouter = () => ({
  push,
  replace,
  back,
});

export const useLocalSearchParams = () => ({
  name: "Test002",
  email: "test002@gmail.com",
  password: "111111",
});

export const Stack = ({ children }: any) => children ?? null;