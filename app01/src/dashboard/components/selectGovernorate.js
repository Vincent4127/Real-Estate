import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, FormControl, Select, MenuItem } from "@mui/material";

/**
 * Governorate -> District -> Cities
 * Extend by adding more districts/cities inside LOCATION_TREE.
 */
const LOCATION_TREE = {
  "": { "": [""] },

  Akkar: {
    Akkar: [
      "Halba",
      "Bebnine",
      "Miniara",
      "Bireh",
      "Qoubaiyat",
      "Andaket",
      "Rahbe",
      "Fnaideq",
      "Wadi Khaled",
    ],
  },

  "North Lebanon": {
    Tripoli: ["Tripoli"],
    Zgharta: ["Zgharta", "Ehden"],
    Bsharri: ["Bsharri", "Hadath El Jebbeh"],
    Koura: ["Amioun", "Kfarhazir", "Deddeh", "Anfeh", "Kousba"],
    Batroun: ["Batroun", "Douma", "Tannourine"],
    "Minieh-Dannieh": ["Minieh", "Sir", "Bakhoun"],
  },

  "Baalbek–Hermel": {
    Baalbek: ["Baalbek", "Douris", "Iaat", "Ras Baalbek"],
    Hermel: ["Hermel", "Al-Qasr", "Sahlat El May"],
  },

  Bekaa: {
    Zahle: ["Zahle", "Qab Elias", "Chtaura"],
    "West Bekaa": ["Joub Jannine", "Machghara", "Kamed El Loz"],
    Rachaya: ["Rachaya", "Kfar Qouq"],
  },

  "Mount Lebanon": {
    Baabda: ["Baabda", "Hazmieh", "Furn El Chebbak", "Hadath"],
    Aley: ["Aley", "Aaramoun", "Ain Dara", "Ainab", "Bhamdoun"],
    Chouf: ["Beiteddine", "Deir El Qamar", "Damous", "Barja"],
    Metn: ["Jdeideh", "Bikfaya", "Broummana", "Antelias"],
  },

  "Keserwan–Jbeil": {
    Keserwan: ["Jounieh", "Ghazir", "Sarba", "Zouk Mosbeh", "Zouk Mikael"],
    Jbeil: ["Byblos (Jbeil)", "Amchit", "Blat", "Halat"],
  },

  "South Lebanon": {
    Sidon: ["Saida (Sidon)"],
    Jezzine: ["Jezzine", "Bkassine"],
    Tyre: ["Sour (Tyre)", "Qana"],
  },

  Nabatieh: {
    Nabatieh: ["Nabatieh", "Kfar Roummane"],
    "Bint Jbeil": ["Bint Jbeil", "Aitaroun"],
    Hasbaya: ["Hasbaya", "Kfar Chouba"],
    Marjeyoun: ["Marjeyoun", "Khiam"],
  },

  Beirut: {
    Beirut: ["Beirut"],
  },
};

// Keep the same styling (dark glass select)
const selectSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    height: 44,
    px: 0.5,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.18)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.28)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.35)",
  },
  "& .MuiSelect-select": {
    color: "rgba(255,255,255,0.92)",
    paddingLeft: "14px",
    paddingRight: "40px",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.75)",
    right: 10,
  },
};

const menuPaperSx = {
  mt: 1,
  borderRadius: 2,
  backgroundColor: "#0b0f14",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
};

function Placeholder({ text }) {
  return <span style={{ color: "rgba(255,255,255,0.45)" }}>{text}</span>;
}

export default function SelectLocation({ onStart }) {
  const [gov, setGov] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const governorates = useMemo(() => Object.keys(LOCATION_TREE), []);

  const districts = useMemo(() => {
    if (!gov) return [];
    return Object.keys(LOCATION_TREE[gov] || {});
  }, [gov]);

  const cities = useMemo(() => {
    if (!gov || !district) return [];
    return LOCATION_TREE[gov]?.[district] || [];
  }, [gov, district]);

  const handleGovChange = (value) => {
    setGov(value);
    setDistrict("");
    setCity("");
  };

  const handleDistrictChange = (value) => {
    setDistrict(value);
    setCity("");
  };

  const handleStart = () => {
    if (!gov || !district || !city) return;
    onStart?.({ governorate: gov, district, city });
  };

  let API = "http://localhost:5000/api/states"
  const [allStates, setAllStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [porp, setProp] = useState(null)

  function Search() {
    localStorage.removeItem("gov");
    localStorage.removeItem("district");
    localStorage.removeItem("city");

    if (gov) localStorage.setItem("gov", gov);
    if (district) localStorage.setItem("district", district);
    if (city) localStorage.setItem("city", city);

    window.dispatchEvent(new Event("search-updated"));
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap on mobile, one row on desktop
      }}
    >
      {/* Governorate */}
      <FormControl size="small" sx={{ ...selectSx, width: 220 }}>
        <Select
          value={gov}
          displayEmpty
          onChange={(e) => handleGovChange(e.target.value)}
          renderValue={(v) => (v ? v : <Placeholder text="Governorate" />)}
          MenuProps={{ PaperProps: { sx: menuPaperSx } }}
        >
          {governorates.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* District */}
      <FormControl
        size="small"
        disabled={!gov}
        sx={{ ...selectSx, width: 220 }}
      >
        <Select
          value={district}
          displayEmpty
          onChange={(e) => handleDistrictChange(e.target.value)}
          renderValue={(v) => (v ? v : <Placeholder text="District" />)}
          MenuProps={{ PaperProps: { sx: menuPaperSx } }}
        >
          {districts.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* City */}
      <FormControl
        size="small"
        disabled={!gov || !district}
        sx={{ ...selectSx, width: 220 }}
      >
        <Select
          value={city}
          displayEmpty
          onChange={(e) => setCity(e.target.value)}
          renderValue={(v) => (v ? v : <Placeholder text="City" />)}
          MenuProps={{ PaperProps: { sx: menuPaperSx } }}
        >
          {cities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Button */}
      <Button
        onClick={Search}
        variant="contained"
        disableElevation
        sx={{
          height: 44,
          minWidth: 140,
          borderRadius: "14px",
          bgcolor: "white",
          color: "black",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
          "&:active": { transform: "scale(0.99)" },
          "&.Mui-disabled": {
            bgcolor: "rgba(255,255,255,0.35)",
            color: "rgba(0,0,0,0.55)",
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
