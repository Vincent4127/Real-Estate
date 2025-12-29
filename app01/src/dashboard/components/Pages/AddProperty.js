import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Button, Container, Divider, FormControl,
    FormHelperText, InputLabel, MenuItem, OutlinedInput,
    Paper, Select, TextField, Typography, Stack
} from "@mui/material";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function AddProperty() {
    const [type, setType] = useState("");
    const [gov, setGov] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState({
        governorate: gov,
        district: district,
        city: city
    });
    const [price, setPrice] = useState(0);
    const [seller, setSeller] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);

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

    const handleCityChange = (value) => {
        setCity(value);
        setLocation({
            governorate: gov,
            district: district,
            city: value
        })
    }

    const [errors, setErrors] = useState({
        contact: "",
        price: "",
        images: "",
        fillErr: ""
    });



    const validateInputs = () => {
        const nextErrors = {
            contact: "",
            price: "",
            images: "",
            fillErr: ""
        };

        let hasError = false;

        if (gov == "" || district == "" || city == "" || type == "") {
            alert("fill all requirments")
            hasError = true;
        }
        // Contact
        if (!contact || !contact.trim().startsWith("+")) {
            nextErrors.contact = "Invalid contact number. Format: +XXX XX XXX XXX";
            hasError = true;
        }

        // Price
        if (!price || Number(price) <= 0) {
            nextErrors.price = "Invalid price. Must be greater than 0.";
            hasError = true;
        }

        // Images
        if (images.length === 0) {
            nextErrors.fillErr = "At least one image is required";
            hasError = true;
        }

        if(hasError){
            alert("Fill all")
        }


        setErrors(nextErrors);

        return !hasError;
    };



    const [newProp, setNewProp] = useState({})
    const userId = localStorage.getItem("userId")
    const STATE_POST_API = `https://real-estate-27ed.onrender.com/api/states/${userId}`

    const submitBtn = async () => {
        if (!validateInputs()) return;

        // ✅ ADDED: show spinner + blur during upload
        setLoading(true);
        try {
            const fd = new FormData();

            fd.append("type", type);
            fd.append(
                "location",
                JSON.stringify({
                    governorate: gov,
                    district,
                    city,
                })
            );
            fd.append("price", String(price));
            fd.append("description", description);
            fd.append("seller", localStorage.getItem("name") || "");
            fd.append("contact", contact);

            images.forEach((file) => {
                fd.append("images", file); // IMPORTANT: same name
            });

            const res = await fetch(STATE_POST_API, {
                method: "POST",
                body: fd, // ✅ NO headers
            });

            if (!res.ok) throw new Error("Upload failed");

            alert("Property added successfully");
        } catch (err) {
            alert(err.message);
        } finally {
            // ✅ ADDED: always stop spinner
            setLoading(false);
        }
    };



    return (
        <>
            {/* ✅ ADDED: blur background + spinner overlay */}
            <Backdrop
                open={loading}
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backdropFilter: "blur(6px)",
                    backgroundColor: "rgba(0,0,0,0.25)",
                }}
            >
                <CircularProgress size={70} thickness={4} />
            </Backdrop>

            <Typography
                variant="h1"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                }}
            >
                Add&nbsp;
                <Typography
                    component="span"
                    variant="h1"
                    sx={(theme) => ({
                        fontSize: 'inherit',
                        color: 'primary.main',
                        ...theme.applyStyles('dark', { color: 'primary.light' }),
                    })}
                >
                    Properties
                </Typography>
            </Typography>
            <Box >
                <Box sx={{ m: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="type-label">Property Type</InputLabel>
                        <Select
                            labelId="type-label"
                            value={type}
                            label="Property Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="apartment">Apartment</MenuItem>
                            <MenuItem value="house">House</MenuItem>
                            <MenuItem value="land">Land</MenuItem>
                            <MenuItem value="penthouse">PentHouse</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ m: 3 }}>
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

                    <FormControl
                        size="small"
                        disabled={!gov || !district}
                        sx={{ ...selectSx, width: 220 }}
                    >
                        <Select
                            value={city}
                            displayEmpty
                            onChange={(e) => handleCityChange(e.target.value)}
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
                </Box>
                <Box sx={{ m: 3 }}>
                    <TextField
                        placeholder="Contact Number: +XXX XX XXX XXX"
                        fullWidth
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        error={Boolean(errors.contact)}
                        helperText={errors.contact}
                    />

                </Box>

                <Box sx={{ m: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Price"
                        onChange={(e) => setPrice(e.target.value)}
                        error={Boolean(errors.price)}
                        helperText={errors.price}
                    />
                </Box>

                <Box sx={{ m: 3 }}>
                    <TextField
                        placeholder="Description"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Typography variant="subtitle1">Images</Typography>

                    <FormControl fullWidth sx={{ m: 3 }} error={Boolean(errors.images)}>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                height: 56,
                                justifyContent: "flex-start",
                                pl: 2,
                                borderStyle: "dashed",
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                            disabled={loading} // ✅ ADDED (optional: avoid changing selection while uploading)
                        >
                            {images.length ? `${images.length} image(s) selected` : "Upload Images"}
                            <input
                                hidden
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages(Array.from(e.target.files || []))}
                            />
                        </Button>

                        <FormHelperText>
                            {errors.images || "Select up to 10 images."}
                        </FormHelperText>
                    </FormControl>

                    <Button variant="contained" fullWidth onClick={submitBtn} disabled={loading}>
                        Add Property
                    </Button>
                </Stack>
            </Box>
        </>
    )
}
