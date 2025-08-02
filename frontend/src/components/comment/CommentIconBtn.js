import React from "react";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // MUI emoji icon

function CommentIconBtn({ handleAction }) {
  const icons = ["👍", "👎", "❤️", "🎉"];

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
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
            },
          },
        }}
      >
        <EmojiEmotionsIcon fontSize='small' />
      </MenuButton>

      <Menu
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "5px",
          gap: "4px",
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
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
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
