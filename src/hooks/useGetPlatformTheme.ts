import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const useGetPlatformTheme = () => {
  const { resolvedTheme } = useTheme();
  return { resolvedTheme: resolvedTheme === "dark" ? dark : undefined };
};

export default useGetPlatformTheme;
