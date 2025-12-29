// PropertyCard.jsx (MUI template style)
// - No like button
// - Fields: type, seller, contact, desc, images (carousel), location, price
// - Looks like your screenshot (chips + big image + rounded card)

import * as React from "react";
import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const API_BASE = "https://real-estate-27ed.onrender.com";

function toImgUrl(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;          // full url already
    if (src.startsWith("/")) return API_BASE + src;     // /uploads/...
    return `${API_BASE}/${src}`;                        // uploads/...
}


function normalizeImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === "string") {
        return images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
}

function formatPrice(price, currency = "USD") {
    const n = Number(price);
    if (!Number.isFinite(n)) return "—";
    return `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function PropertyCard({
    property,
    onOpen = () => { },
    badge = "Platinum",
    status = "Sale",
}) {
    const images = useMemo(() => normalizeImages(property?.images), [property?.images]);
    const [idx, setIdx] = useState(0);
    const canSlide = images.length > 1;

    const currentImg =
        toImgUrl(images[idx]) || "https://via.placeholder.com/1200x700?text=No+Image";


    const next = (e) => {
        e?.stopPropagation();
        if (!canSlide) return;
        setIdx((p) => (p + 1) % images.length);
    };

    const prev = (e) => {
        e?.stopPropagation();
        if (!canSlide) return;
        setIdx((p) => (p - 1 + images.length) % images.length);
    };

    const type = property?.type || "Property";
    const seller = property?.seller || "—";
    const contact = property?.contact || "—";
    const desc = property?.description || "No description";
    const loc = property?.location || {};
    const locationText =
        [loc.city, loc.district, loc.governorate].filter(Boolean).join(", ") || "—";
    const priceText = formatPrice(property?.price, property?.currency || "USD");

    return (
        <Card
            variant="outlined"
            onClick={() => onOpen(property)}
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
            }}
        >
            {/* Image header */}
            <Box sx={{ position: "relative" }}>
                <Box
                    component="img"
                    src={currentImg}
                    alt={type}
                    sx={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        display: "block",
                    }}
                />

                {/* Bottom-left overlay (badge + type) */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 12,
                        bottom: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.25,
                        py: 0.75,
                        borderRadius: 3,
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "common.white",
                        backdropFilter: "blur(3px)",
                    }}
                >
                    <Chip
                        label={badge}
                        size="small"
                        sx={{
                            height: 22,
                            fontWeight: 800,
                            borderRadius: 2,
                            bgcolor: "common.white",
                            color: "text.primary",
                        }}
                    />
                    <Typography sx={{ fontWeight: 900, letterSpacing: 0.6 }}>
                        {String(type).toUpperCase()}
                    </Typography>
                </Box>

                {/* Top-right status chip */}
                <Chip
                    label={status}
                    size="small"
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        borderRadius: 3,
                        fontWeight: 800,
                        bgcolor: "background.paper",
                    }}
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Carousel arrows */}
                {canSlide && (
                    <>
                        <IconButton
                            onClick={prev}
                            aria-label="Previous image"
                            size="small"
                            sx={{
                                position: "absolute",
                                left: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                bgcolor: "rgba(255,255,255,0.85)",
                                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                            }}
                        >
                            <ArrowBackIosNewRoundedIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={next}
                            aria-label="Next image"
                            size="small"
                            sx={{
                                position: "absolute",
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                bgcolor: "rgba(255,255,255,0.85)",
                                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                            }}
                        >
                            <ArrowForwardIosRoundedIcon fontSize="inherit" />
                        </IconButton>
                    </>
                )}

                {/* Dots */}
                {canSlide && (
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: "absolute",
                            right: 12,
                            bottom: 12,
                            display: "flex",
                            gap: 0.75,
                            px: 1,
                            py: 0.5,
                            borderRadius: 999,
                            bgcolor: "rgba(0,0,0,0.35)",
                        }}
                    >
                        {images.slice(0, 8).map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    bgcolor: i === idx ? "common.white" : "rgba(255,255,255,0.55)",
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Body */}
            <CardContent sx={{ p: 2 }}>
                {/* type + status like screenshot row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Chip
                        label={type}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 3, fontWeight: 800 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Chip
                        label={status}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 3, fontWeight: 800 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Stack>

                {/* Price */}
                <Typography sx={{ fontSize: 20, fontWeight: 900, color: "error.main", mb: 1 }}>
                    {priceText}
                </Typography>

                {/* Description */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 900,
                        lineHeight: 1.25,
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {desc}
                </Typography>

                {/* seller + contact */}
                <Stack spacing={0.25} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                            Seller:
                        </Box>{" "}
                        {seller}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>
                            Contact:
                        </Box>{" "}
                        {contact}
                    </Typography>
                </Stack>

                {/* location */}
                <Stack direction="row" spacing={0.75} alignItems="center">
                    <LocationOnRoundedIcon fontSize="small" />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {locationText}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
