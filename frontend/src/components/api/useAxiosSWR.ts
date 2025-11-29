/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import AxiosFetcher from "./AxiosFetcher";

// Instance of AxiosFetcher
// console.log({ meta_vite: import.meta.env });
export const fetcher = new AxiosFetcher(
  import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || ""
);

// config for swr
const SWRoptions = {
  revalidateOnFocus: true,
  shouldRetryOnError: false,
  loadingTimeout: 3000,
};

// main hook content
const useAxiosSWR = <Data, Error = any>(
  url: string | null,
  options?: Record<string, any>
) => {
  const swrKey = url ? [url, options] as const : null;
  const { data, error, mutate } = useSWR<Data, Error>(
    swrKey,
    () => fetcher.get(url as string, options),
    {
      ...SWRoptions,
      ...options?.forSWR,
      refreshInterval: options?.refreshInterval || 0,
    }
  );

  return {
    data,
    error,
    isLoading: Boolean(url) && !error && !data,
    mutate,
  };
};

export default useAxiosSWR;
