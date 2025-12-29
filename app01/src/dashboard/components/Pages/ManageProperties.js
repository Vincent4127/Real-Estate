// ManageProperties.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const API_BASE = "https://real-estate-27ed.onrender.com";

// ---------------- Helpers ----------------
function parseImages(imagesField) {
    if (!imagesField) return [];
    if (Array.isArray(imagesField)) return imagesField.filter(Boolean);
    if (typeof imagesField === "string") {
        const s = imagesField.trim();
        try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch (_) {
            if (s) return [s];
        }
    }
    return [];
}

function toPublicUrl(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    const clean = src.startsWith("/") ? src : `/${src}`;
    return `${API_BASE}${clean}`;
}

function formatLocation(loc) {
    if (!loc) return "—";
    if (typeof loc === "string") return loc;

    const city = (loc.city || "").toString().trim();
    const district = (loc.district || "").toString().trim();
    const gov = (loc.governorate || loc.gov || "").toString().trim();

    const parts = [city, district, gov].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
}

function formatPrice(price) {
    // Your backend says price is required, but just in case:
    if (price === null || price === undefined || price === "") return "—";

    const n =
        typeof price === "number"
            ? price
            : Number(String(price).replace(/[^\d.]/g, ""));

    if (!Number.isFinite(n)) return "—";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(n);
}

// ---------------- Component ----------------
export default function ManageProperties() {
    // You said: fetch each user's properties
    // We'll use localStorage userId (common in your app)
    const userId = useMemo(() => localStorage.getItem("userId") || "", []);
    const [rows, setRows] = useState([]); // user's embedded properties
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [selectedId, setSelectedId] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const selectedRow = useMemo(
        () => rows.find((r) => (r.propertyId || r._id || r.id) === selectedId),
        [rows, selectedId]
    );

    async function loadUserProperties() {
        setLoading(true);
        setErr("");
        try {
            if (!userId) throw new Error("Missing userId in localStorage.");

            const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}`);
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `Request failed (${res.status})`);
            }

            const user = await res.json();
            const props = Array.isArray(user?.properties) ? user.properties : [];
            setRows(props);

            // if selected got deleted / removed
            setSelectedId((prev) => (props.some((p) => (p.propertyId || p._id) === prev) ? prev : null));
        } catch (e) {
            setErr(e?.message || "Failed to load properties");
            setRows([]);
            setSelectedId(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUserProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const displayed = useMemo(() => {
        const start = page * rowsPerPage;
        return rows.slice(start, start + rowsPerPage);
    }, [rows, page, rowsPerPage]);

    function toggleSelect(id) {
        // click once -> select
        // click again same row -> deselect
        setSelectedId((prev) => (prev === id ? null : id));
    }

    async function doDelete() {
        if (!selectedRow) return;

        setDeleting(true);
        setErr("");
        try {
            // IMPORTANT: your delete route is /api/states/:propertyId
            const pid = selectedRow.propertyId || selectedRow._id || selectedRow.id;

            const res = await fetch(`${API_BASE}/api/states/${encodeURIComponent(pid)}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `Delete failed (${res.status})`);
            }

            setConfirmOpen(false);
            setSelectedId(null);

            // reload from user endpoint so UI matches DB (embedded properties updated)
            await loadUserProperties();
        } catch (e) {
            setErr(e?.message || "Delete failed");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                px: { xs: 2, md: 6 },
                py: { xs: 3, md: 5 },
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                <Typography variant="overline" sx={{ letterSpacing: 1.8, opacity: 0.7 }}>
                    PROPERTIES
                </Typography>

                <Typography
                    variant="h3"
                    sx={{
                        mt: 0.5,
                        fontWeight: 800,
                        letterSpacing: -0.5,
                        fontSize: { xs: 34, md: 44 },
                    }}
                >
                    Manage Properties
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        borderRadius: 4,
                        overflow: "hidden",
                        position: "relative",
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundImage: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                                : "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {loading ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2, opacity: 0.75 }}>
                                Loading properties…
                            </Typography>
                        </Stack>
                    ) : (
                        <>
                            <TableContainer sx={{ maxHeight: 520 }}>
                                <Table stickyHeader aria-label="properties table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: 90, bgcolor: "transparent", borderBottomColor: "divider" }} />
                                            <TableCell sx={{ fontWeight: 800, fontSize: 18, bgcolor: "transparent", borderBottomColor: "divider" }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800, fontSize: 18, bgcolor: "transparent", borderBottomColor: "divider" }}>
                                                Price
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800, fontSize: 18, bgcolor: "transparent", borderBottomColor: "divider" }}>
                                                Location
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800, fontSize: 18, bgcolor: "transparent", borderBottomColor: "divider" }}>
                                                Contact
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {displayed.map((p) => {
                                            const rowId = p.propertyId || p._id || p.id;
                                            const images = parseImages(p.images);
                                            const img =
                                                toPublicUrl(images[0]) ||
                                                "https://via.placeholder.com/1200x700?text=No+Image";

                                            const isSelected = selectedId === rowId;

                                            return (
                                                <TableRow
                                                    key={rowId}
                                                    hover
                                                    onClick={() => toggleSelect(rowId)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        "& td": { borderBottomColor: "divider" },
                                                        ...(isSelected && {
                                                            backgroundColor: (theme) =>
                                                                theme.palette.mode === "dark"
                                                                    ? "rgba(255,255,255,0.06)"
                                                                    : "rgba(0,0,0,0.04)",
                                                        }),
                                                    }}
                                                >
                                                    <TableCell sx={{ width: 90 }}>
                                                        <Box
                                                            sx={{
                                                                width: 64,
                                                                height: 44,
                                                                borderRadius: 2,
                                                                overflow: "hidden",
                                                                border: "1px solid",
                                                                borderColor: "divider",
                                                                backgroundColor: "background.paper",
                                                                backgroundImage: `url(${img})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ fontSize: 18 }}>
                                                        {(p.type || "—").toString()}
                                                    </TableCell>

                                                    <TableCell sx={{ fontSize: 18 }}>
                                                        {formatPrice(p.price)}
                                                    </TableCell>

                                                    <TableCell
                                                        sx={{
                                                            fontSize: 18,
                                                            maxWidth: 440,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                        title={formatLocation(p.location)}
                                                    >
                                                        {formatLocation(p.location)}
                                                    </TableCell>

                                                    <TableCell sx={{ fontSize: 18 }}>
                                                        {(p.contact || "—").toString()}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}

                                        {displayed.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ py: 8 }}>
                                                    <Stack alignItems="center" spacing={1}>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, opacity: 0.9 }}>
                                                            No properties found
                                                        </Typography>
                                                        <Typography sx={{ opacity: 0.75 }}>
                                                            Add a property first, then it will appear here.
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                                <TablePagination
                                    component="div"
                                    count={rows.length}
                                    page={page}
                                    onPageChange={(_, newPage) => setPage(newPage)}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </Box>

                            {err ? (
                                <Box sx={{ px: 2, pb: 2 }}>
                                    <Typography sx={{ color: "error.main" }}>{err}</Typography>
                                </Box>
                            ) : null}

                            {/* Delete button only appears when a row is selected */}
                            {selectedId ? (
                                <Box sx={{ position: "absolute", right: 18, bottom: 70 }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: "error.main",
                                            borderColor: "error.main",
                                            "&:hover": {
                                                borderColor: "error.dark",
                                                backgroundColor: "rgba(211,47,47,0.08)",
                                                borderRadius: 2.5,
                                                px: 2.2,
                                                py: 1.2,
                                                fontSize: 16,
                                                textTransform: "none",
                                                borderWidth: 1.5,
                                            },
                                        }}

                                        startIcon={<DeleteOutlineRoundedIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            ) : null}
                        </>
                    )}
                </Paper>
            </Box>

            {/* Confirm dialog */}
            <Dialog open={confirmOpen} onClose={() => (!deleting ? setConfirmOpen(false) : null)}>
                <DialogTitle sx={{ fontWeight: 900 }}>Delete property?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete{" "}
                        <strong>{selectedRow?.type || "this property"}</strong>. You can’t undo this action.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={doDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={18} /> : null}
                    >
                        {deleting ? "Deleting…" : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
