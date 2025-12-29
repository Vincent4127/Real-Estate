import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function VRMarkIcon(props) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 120 64"
      role="img"
      aria-label="VR logo"
    >
      {/* Letter V */}
      <path
        d="M12 14 L32 50 L52 14"
        fill="none"
        stroke="#4FC3F7"     // light blue
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter R - vertical stem */}
      <path
        d="M70 14 V50"
        fill="none"
        stroke="#5E35B1"     // dark purple
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Letter R - bowl */}
      <path
        d="M70 14 H88
           C98 14 104 20 104 28
           C104 36 98 42 88 42
           H70"
        fill="none"
        stroke="#5E35B1"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter R - leg */}
      <path
        d="M88 42 L108 50"
        fill="none"
        stroke="#5E35B1"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}
