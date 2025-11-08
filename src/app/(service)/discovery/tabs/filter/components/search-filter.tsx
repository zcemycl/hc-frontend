export const SearchFilter = ({
  term,
  setTerm,
}: {
  term: string;
  setTerm: (s: string) => void;
}) => {
  return (
    <>
      <div
        className="flex flex-row justify-start
        text-left content-start items-start w-full"
      >
        <span className="text-black font-bold">Keyword</span>
      </div>

      <input
        value={term}
        onChange={(e) => {
          e.preventDefault();
          setTerm(e.target.value.toLowerCase());
        }}
        className={`w-full
            p-2 bg-slate-100 text-black rounded-lg
            `}
        type="input"
      />
    </>
  );
};
