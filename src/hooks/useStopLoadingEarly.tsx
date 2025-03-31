import { useLoader } from "@/contexts";
import { useEffect } from "react";

const useStopLoadingEarly = () => {
  const { setIsLoading } = useLoader();
  useEffect(() => {
    setIsLoading(false);
  }, []);
};

export { useStopLoadingEarly };
