import React, { useState, useEffect } from 'react';
import SelectGovernorate from '../selectGovernorate.js';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import PropertyCard from '../pagesComponents/propertiesCard.js';

let API = 'http://localhost:5000/api/states';

export default function Home() {
  const [allStates, setAllStates] = useState([]);
  const [shownStates, setShownStates] = useState([]); // ✅ what we actually render
  const [loading, setLoading] = useState(true);

  // ✅ fetch once
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then((data) => {
        setAllStates(data);
        setShownStates(data); // ✅ default show all
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ✅ run search when SelectGovernorate triggers the event
  useEffect(() => {
    const runSearch = () => {
      const gov = localStorage.getItem("gov") || "";
      const district = localStorage.getItem("district") || "";
      const city = localStorage.getItem("city") || "";

      // ✅ if nothing selected -> show all
      if (!gov && !district && !city) {
        setShownStates(allStates);
        return;
      }

      // ✅ filter locally
      const g = gov.trim().toLowerCase();
      const d = district.trim().toLowerCase();
      const c = city.trim().toLowerCase();

      const filtered = allStates.filter((p) => {
        const loc = p.location || {};
        const pg = (loc.governorate || "").toLowerCase();
        const pd = (loc.district || "").toLowerCase();
        const pc = (loc.city || "").toLowerCase();

        const okGov = !g || pg === g;
        const okDist = !d || pd === d;
        const okCity = !c || pc === c;

        return okGov && okDist && okCity;
      });

      setShownStates(filtered);
    };

    const handler = () => runSearch();
    window.addEventListener("search-updated", handler);

    return () => window.removeEventListener("search-updated", handler);
  }, [allStates]);

  const displayProps = () => {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {shownStates.map((state) => (
          <Grid key={state._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <PropertyCard
              property={state}
              badge={state.seller}
              status={state.status}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          fontSize: 'clamp(3rem, 10vw, 3.5rem)',
        }}
      >
        Search&nbsp;
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

      <SelectGovernorate />

      <Backdrop
        open={loading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <CircularProgress size={70} thickness={4} />
      </Backdrop>

      {displayProps()}
    </>
  );
}


// import React, { useState, useEffect } from 'react';
// import SelectGovernorate from '../selectGovernorate.js';
// import Typography from '@mui/material/Typography';
// import PropertyCard from '../pagesComponents/propertiesCard.js'
// import CircularProgress from "@mui/material/CircularProgress";
// import Backdrop from "@mui/material/Backdrop";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import PropertyCard from '../pagesComponents/propertiesCard.js';

// let API = 'http://localhost:5000/api/states'

// export default function Home() {
//   const [allStates, setAllStates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(API)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch properties");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setAllStates(data);
//       })
//       .catch((err) => {
//         console.error(err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const displayAllProps = () => {
//     return (
//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         {allStates.map((state) => (
//           <Grid key={state._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
//             <PropertyCard
//               property={state}
//               badge={state.seller}
//               status={state.status}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     )
//   }
  
//   const [index, setIndex] = useState(0);

//   const Search = () => {
//     let gov = localStorage.getItem("gov")
//     let district = localStorage.getItem("district")
//     let city = localStorage.getItem("city")

//     if(gov === "" && district === "" && city === ""){
//       setIndex(0);
//       return;
//     }

//     setIndex(1)

//     for(let i = 0; i < allStates.length; ++i){
//       if(allStates[i].location.gov === gov || allStates[i].location.district === district
//         || allStates[i].location.city === city){
//           <PropertyCard property={allStates[i]}></PropertyCard>
//       }
//     }

//   }


//   function display() {
//     if (index === 0) {
//       return displayAllProps()
//     }
//   }

//   return (
//     <>
//       <Typography
//         variant="h1"
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'row' },
//           alignItems: 'center',
//           fontSize: 'clamp(3rem, 10vw, 3.5rem)',
//         }}
//       >

//         Search&nbsp;
//         {/* latest&nbsp; */}
//         <Typography
//           component="span"
//           variant="h1"
//           sx={(theme) => ({
//             fontSize: 'inherit',
//             color: 'primary.main',
//             ...theme.applyStyles('dark', {
//               color: 'primary.light',
//             }),
//           })}
//         >
//           Properties
//         </Typography>
//       </Typography>
//       <SelectGovernorate></SelectGovernorate>
//       {/* 🔵 Loading Overlay */}
//       <Backdrop
//         open={loading}
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backdropFilter: "blur(6px)",
//           backgroundColor: "rgba(0,0,0,0.25)",
//         }}
//       >
//         <CircularProgress size={70} thickness={4} />
//       </Backdrop>
//       {display()}
//       {/* 🏠 Properties */}
//     </>
//   );
// }