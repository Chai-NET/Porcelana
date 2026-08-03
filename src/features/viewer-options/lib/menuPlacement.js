import {
  MENU_WIDTH_PX,
  MENU_HEIGHT_PX,
  SUBMENU_WIDTH_PX,
  SUBMENU_OVERHANG_PX,
} from "../config/menu";

export const placeMenu = ({ x, y }) => {
  const left = Math.min(x, window.innerWidth - MENU_WIDTH_PX);
  const top = Math.min(
    y,
    window.innerHeight - MENU_HEIGHT_PX - SUBMENU_OVERHANG_PX,
  );

  return {
    left,
    top,
    flipSubmenu: left + MENU_WIDTH_PX + SUBMENU_WIDTH_PX > window.innerWidth,
  };
};
