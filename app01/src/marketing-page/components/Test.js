// TestPropertiesSingleFile.jsx
// Paste this file anywhere (e.g. src/TestPropertiesSingleFile.jsx) and render <TestPropertiesSingleFile />

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
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
// Accept: "url1,url2,url3" OR "url1|url2" OR just "url1"
function parseImages(imagesStr) {
  if (!imagesStr) return [];
  return imagesStr
    .split(/[,|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function PropertyCard({
  property,
  onOpen = () => {},
  badge = "Platinum",
  status = "Sale",
}) {
  const images = useMemo(() => parseImages(property?.images), [property?.images]);
  const [idx, setIdx] = useState(0);
  const canSlide = images.length > 1;

  const next = (e) => {
    e?.stopPropagation();
    if (!canSlide) return;
    setIdx((p) => (p + 1) % images.length);
  };

  const currentImg =
    images[idx] || "https://via.placeholder.com/1200x700?text=No+Image";

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
        "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
      }}
    >
      {/* Image header */}
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={currentImg}
          alt={property?.type || "Property"}
          loading="lazy"
          draggable={false}
          sx={{
            width: "100%",
            height: 210,
            objectFit: "cover",
            display: "block",
            bgcolor: "grey.100",
            userSelect: "none",
          }}
        />

        {/* soft overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge + big overlay title */}
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
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
              maxWidth: "85%",
            }}
          >
            {property?.type || "Property"}
          </Typography>
        </Box>

        {/* Next arrow (carousel) */}
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

        <Typography
          sx={{ mt: 1.25, color: "error.main", fontWeight: 800 }}
          variant="h6"
        >
          {formatPrice(property?.price)}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
          }}
        >
          {property?.description || "No description"}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.25 }}>
          <LocationOnRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property?.location || "Unknown location"}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1.25 }} />

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


export default function TestPropertiesSingleFile() {
  // ✅ Your schema fields only:
  const properties = [
    {
      type: "Apartment",
      location: "Dbaye, Metn",
      price: 360000,
      contact: "+961 71 123 456",
      seller: "Platinum Real Estate",
      description: "Waterfront city / 1 Bedroom / Terrace • Negotiable price",
      images:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80, https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
    },
    {
      type: "Apartment",
      location: "Mansourieh, Metn",
      price: 260000,
      contact: "+961 71 555 222",
      seller: "Luxury Homes",
      description: "Luxury fully furnished apartment in Mansourieh (REF style demo)",
      images:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80, https://images.unsplash.com/photo-1505691723518-36a5ac3b2d37?auto=format&fit=crop&w=1400&q=80",
    },
    {
      type: "Duplex",
      location: "Jnah, Beirut",
      price: 1250000,
      contact: "+961 71 888 999",
      seller: "Prime Realty",
      description: "700 SQM triplex in prime location Jnah for sale",
      images:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80, https://images.unsplash.com/photo-1560448071-9a0c2b6e8b56?auto=format&fit=crop&w=1400&q=80, https://images.unsplash.com/photo-1505691723518-36a5ac3b2d37?auto=format&fit=crop&w=1400&q=80",
    },
    {
      type: "Villa",
      location: "Zgharta Town, Zgharta",
      price: 325000,
      contact: "+961 70 444 333",
      seller: "Northern Properties",
      description: "Panoramic and expanded view villa in Zgharta",
      images:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80, https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Featured Properties
      </Typography>

      <Grid container spacing={2.5}>
        {properties.map((p) => (
          <Grid key={p.location} item xs={12} sm={6} md={4} lg={3}>
            <PropertyCard
              property={p}
              badge="Platinum"
              status="Sale"
              onOpen={(prop) => console.log("Open details:", prop)}
              onFavorite={(prop) => console.log("Favorite:", prop)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
