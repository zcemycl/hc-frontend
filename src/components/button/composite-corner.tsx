import { X_CIRCLE_ICON_URI } from "@/icons/bootstrap";

const CompositeCorner = ({
  label,
  click_callback,
  del_callback,
}: {
  label: string;
  click_callback: () => void;
  del_callback?: () => void;
}) => {
  return (
    <div
      className="relative w-full"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        click_callback();
      }}
    >
      <div
        className={`text-black font-medium whitespace-nowrap
            transition-transform duration-1000`}
      >
        {label}
      </div>
      {del_callback && (
        <button
          className="flex items-center justify-center
                absolute -top-2 -right-2
                rounded-full bg-red-400
                translate-x-2 z-10
                hover:bg-red-500 transition-colors"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            del_callback();
          }}
        >
          <img src={X_CIRCLE_ICON_URI} />
        </button>
      )}
    </div>
  );
};

export { CompositeCorner };
