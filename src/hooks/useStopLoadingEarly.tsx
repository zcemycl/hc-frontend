import { useLoader } from "@/contexts";
import { useEffect } from "react";

const useStopLoadingEarly = () => {
  const { setIsLoading } = useLoader();
  useEffect(() => {
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useStopLoadingEarly };
