import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VRMarkIcon from "./VRMarkIcon"
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { useName, useEmail } from "../../authentication";

const drawerWidth = 280;

export default function SideMenuMobile({
  open,
  onClose,
  selectedIndex,
  setSelectedIndex,
}) {
  const { name } = useName();
  const { email } = useEmail();

  return (
    <Drawer
      anchor="left"
      open={Boolean(open)}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "background.paper",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack direction="row" sx={{ alignItems: "center", px: 1.5, py: 1 }}>
          <Typography sx={{ fontWeight: 700, mr: "auto" }}>Menu</Typography>
          <IconButton onClick={onClose} aria-label="Close menu">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            minHeight: 56, // ✅ same vertical presence as SelectContent
          }}
        >
          <VRMarkIcon
            sx={{
              fontSize: 40, // 🔑 makes it as big as SelectContent icon
              color: "primary.main",
            }}
          />
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <MenuContent selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
        </Box>

        <Divider />

        <Stack direction="row" sx={{ p: 2, alignItems: "center", gap: 1 }}>
          <Box sx={{ mr: "auto", minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
              {email}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Box>
    </Drawer>
  );
}
