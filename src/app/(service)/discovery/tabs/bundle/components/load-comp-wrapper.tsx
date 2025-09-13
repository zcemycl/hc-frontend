import { Spinner } from "@/components";

export const LoaderComponentWrapper = ({
  genericIsLoading,
  children,
}: {
  genericIsLoading: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative w-full h-full">
      {genericIsLoading && (
        <div
          className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2 
            z-50 items-center"
        >
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {children}
    </div>
  );
};
