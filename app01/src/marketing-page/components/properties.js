import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

function formatPrice(value) {
  if (value === null || value === undefined) return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `USD ${value}`;
  }
}

// images is String in your schema.
// We’ll accept: "url1,url2,url3" OR "url1|url2" OR just "url1".
function parseImages(imagesStr) {
  if (!imagesStr) return [];
  // support comma or pipe separated
  const parts = imagesStr.split(/[,|]/g).map((s) => s.trim()).filter(Boolean);
  return parts;
}

export default function PropertyCard({
  property,
  onFavorite = () => {},
  onOpen = () => {},
  badge = "Platinum", // optional label like in screenshot
  status = "Sale", // optional chip like "Sale"
}) {
  const images = useMemo(() => parseImages(property?.images), [property?.images]);
  const [idx, setIdx] = useState(0);

  const canSlide = images.length > 1;

  const next = (e) => {
    e?.stopPropagation();
    if (!canSlide) return;
    setIdx((p) => (p + 1) % images.length);
  };

  const currentImg = images[idx] || "";

  return (
    <Card
      onClick={() => onOpen(property)}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
      }}
    >
      {/* Image header */}
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={currentImg || "https://via.placeholder.com/800x500?text=No+Image"}
          alt={property?.type || "Property"}
          loading="lazy"
          sx={{
            width: "100%",
            height: 210, // close to screenshot ratio
            objectFit: "cover",
            display: "block",
            bgcolor: "grey.100",
          }}
        />

        {/* soft overlay like screenshot */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Favorite (top-right) */}
        <Tooltip title="Save">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(property);
            }}
            aria-label="save property"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <FavoriteBorderRoundedIcon sx={{ color: "error.main" }} />
          </IconButton>
        </Tooltip>

        {/* Badge + Big title overlay (like screenshot) */}
        <Box sx={{ position: "absolute", left: 12, bottom: 12, right: 12 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: "divider",
                fontWeight: 700,
              }}
            />
          </Stack>

          <Typography
            variant="subtitle1"
            sx={{
              color: "common.white",
              fontWeight: 800,
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              // mimic “WITH 55 SQM...” overlay style
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
              maxWidth: "85%",
            }}
          >
            {property?.type || "Property"}
          </Typography>
        </Box>

        {/* Carousel next button (right-middle) */}
        {canSlide && (
          <IconButton
            onClick={next}
            aria-label="next image"
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.9)",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        )}

        {/* Dots */}
        {canSlide && (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              position: "absolute",
              left: 12,
              top: 12,
              bgcolor: "rgba(0,0,0,0.25)",
              borderRadius: 999,
              px: 1,
              py: 0.5,
            }}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  bgcolor: i === idx ? "common.white" : "rgba(255,255,255,0.55)",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Type + Status chip row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            label={property?.type || "Type"}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label={status}
            size="small"
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2 }}
          />
        </Stack>

        {/* Price */}
        <Typography
          sx={{ mt: 1.25, color: "error.main", fontWeight: 800 }}
          variant="h6"
        >
          {formatPrice(property?.price)}
        </Typography>

        {/* Title-ish line (use description start like screenshot) */}
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {property?.description || "No description"}
        </Typography>

        {/* Location */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.25 }}>
          <LocationOnRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property?.location || "Unknown location"}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1.25 }} />

        {/* Seller + Contact (since you have these fields) */}
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {property?.seller || "Unknown seller"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {property?.contact || "No contact"}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
