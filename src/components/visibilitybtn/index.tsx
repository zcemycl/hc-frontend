import { EYE_ICON_URI, EYE_SLASH_ICON_URI } from "@/icons/bootstrap";

export const VisibilityBtn = ({
  isHidden = false,
  isShowText = false,
}: {
  isHidden: boolean;
  isShowText: boolean;
}) => {
  if (isHidden) {
    return (
      <>
        {isShowText && <span>Hidden</span>}
        <img src={EYE_SLASH_ICON_URI} alt="connected" />
      </>
    );
  } else {
    return (
      <>
        {isShowText && <span>Visible</span>}
        <img src={EYE_ICON_URI} alt="connected" />
      </>
    );
  }
};
