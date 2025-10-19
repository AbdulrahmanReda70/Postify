import React from "react";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // MUI emoji icon

function CommentIconBtn({ handleAction }) {
  const icons = ["👍", "👎", "❤️", "🎉"];
  // Dark theme colors
  const darkBg = "#222831";
  const darkHover = "#393e46";
  const darkMenuBg = "#23272f";
  const darkMenuItemHover = "#393e46";
  const darkIconColor = "#ffd369";

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            variant: "soft",
            color: "primary",
            size: "sm",
            sx: {
              borderRadius: "50%",
              backgroundColor: darkBg,
              marginBottom: "5px",
              color: darkIconColor,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: darkHover,
              },
            },
          },
        }}
      >
        <EmojiEmotionsIcon fontSize='small' sx={{ color: darkIconColor }} />
      </MenuButton>

      <Menu
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "5px",
          gap: "4px",
          backgroundColor: darkMenuBg,
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        {icons.map((icon, index) => (
          <MenuItem
            onClick={() => handleAction(icon)}
            key={index}
            sx={{
              fontSize: "13px",
              borderRadius: "8px",
              padding: "5px 10px",
              backgroundColor: darkMenuBg,
              color: darkIconColor,
              "&:hover": {
                backgroundColor: darkMenuItemHover,
              },
            }}
          >
            {icon}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}

export default CommentIconBtn;
