// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
// import MuiCard from '@mui/material/Card';
// import { styled } from '@mui/material/styles';
// import AppTheme from '../shared-theme/AppTheme';
// import ColorModeSelect from '../shared-theme/ColorModeSelect';
// import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
// import { useNavigate } from "react-router-dom";

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: 'auto',
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//   [theme.breakpoints.up('sm')]: {
//     width: '450px',
//   },
//   ...theme.applyStyles('dark', {
//     boxShadow:
//       'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
//   }),
// }));

// const SignUpContainer = styled(Stack)(({ theme }) => ({
//   height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
//   minHeight: '100%',
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
//   '&::before': {
//     content: '""',
//     display: 'block',
//     position: 'absolute',
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//       backgroundImage:
//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
//   },
// }));

// export default function SignUp(props) {
//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
//   const [nameError, setNameError] = React.useState(false);
//   const [nameErrorMessage, setNameErrorMessage] = React.useState('');
//   const [contactError, setContactError] = React.useState(false);
//   const [contactErrorMessage, setContactErrorMessage] = React.useState('');

//   const API = "http://localhost:5000/api/users";

//   let data = [];

//   async function getUsers() {
//     try {
//       const response = await fetch(API);
//       data = await response.json();
//       console.log("All users are stored in the array:", data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function addUser(email, password, name, contact) {
//     try {

//       const newUser = {
//         name: name,
//         email: email,
//         password: password,
//         contact: contact
//       }

//       const response = await fetch(API, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newUser),
//       });

//       if (response.status === 400) {
//         throw new Error("Email already exists");
//       }
//       alert("User added successfully. You can now sign in.");
//     } catch (error) {
//       console.error(error);
//       alert("Error adding user: " + error.message);
//     }
//   }

//   const navigate = useNavigate();

//   const validateInputs = async (e) => {
//     e.preventDefault();

//     const email = document.getElementById('email');
//     const password = document.getElementById('password');
//     const name = document.getElementById('name');
//     const contact = document.getElementById('contact')

//     let isValid = true;
//     await getUsers()

//     if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
//       setEmailError(true);
//       setEmailErrorMessage('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     if (!password.value || password.value.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage('Password must be at least 6 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage('');
//     }

//     if (!name.value || name.value.length < 1) {
//       setNameError(true);
//       setNameErrorMessage('Name is required.');
//       isValid = false;
//     } else {
//       setNameError(false);
//       setNameErrorMessage('');
//     }

//     if (!contact.value || contact.value.length < 5 || contact.value[0] != "+") {
//       setContactError(true);
//       setContactErrorMessage('Invalid Contact Number');
//     } else {
//       setContactError(false);
//       setContactErrorMessage('');
//     }

//     data.forEach(element => {
//       if(element.email === email.value){
//         isValid = false;
//         setEmailError(true);
//         setEmailErrorMessage('Email already exists');
//         return;
//       }
//     });


//     if (isValid) {
//       addUser(email.value, password.value, name.value, contact.value);
//       console.log("User added successfully");

//       const params = new URLSearchParams(window.location.search);
//       const destination = params.get("to") || "/SignIn";
//       console.log("Navigation to:", destination);
//       navigate(destination, { replace: true });
//     }

//     return isValid;
//   };

//   const handleSubmit = (event) => {
//     if (nameError || emailError || passwordError) {
//       event.preventDefault();
//       return;
//     }
//     const data = new FormData(event.currentTarget);
//     console.log({
//       name: data.get('name'),
//       lastName: data.get('lastName'),
//       email: data.get('email'),
//       password: data.get('password'),
//       contact: data.get('contact')
//     });

//   };

//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
//       <SignUpContainer direction="column" justifyContent="space-between">
//         <Card variant="outlined">
//           <SitemarkIcon />
//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
//           >
//             Sign up
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
//           >
//             <FormControl>
//               <FormLabel htmlFor="name">Full name</FormLabel>
//               <TextField
//                 autoComplete="name"
//                 name="name"
//                 required
//                 fullWidth
//                 id="name"
//                 placeholder="Jon Snow"
//                 error={nameError}
//                 helperText={nameErrorMessage}
//                 color={nameError ? 'error' : 'primary'}
//               />
//             </FormControl>
//             <FormControl>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <TextField
//                 required
//                 fullWidth
//                 id="email"
//                 placeholder="your@email.com"
//                 name="email"
//                 autoComplete="email"
//                 variant="outlined"
//                 error={emailError}
//                 helperText={emailErrorMessage}
//                 color={passwordError ? 'error' : 'primary'}
//               />
//             </FormControl>
//             <FormControl>
//               <FormLabel htmlFor="contact">Contact</FormLabel>
//               <TextField
//                 required
//                 fullWidth
//                 id="contact"
//                 placeholder="+XXX XX XXX XXX"
//                 name="contact"
//                 autoComplete="contact"
//                 variant="outlined"
//                 error={contactError}
//                 helperText={contactErrorMessage}
//                 color={passwordError ? 'error' : 'primary'}
//               />
//             </FormControl>
//             <FormControl>
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <TextField
//                 required
//                 fullWidth
//                 name="password"
//                 placeholder="••••••"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 variant="outlined"
//                 error={passwordError}
//                 helperText={passwordErrorMessage}
//                 color={passwordError ? 'error' : 'primary'}
//               />
//             </FormControl>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               onClick={validateInputs}
//             >
//               Sign up
//             </Button>
//           </Box>
//           <Divider>
//             <Typography sx={{ color: 'text.secondary' }}>or</Typography>
//           </Divider>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

//             <Typography sx={{ textAlign: 'center' }}>
//               Already have an account?{' '}
//               <Link
//                 href="/SignIn"
//                 variant="body2"
//                 sx={{ alignSelf: 'center' }}
//               >
//                 Sign in
//               </Link>
//             </Typography>
//           </Box>
//         </Card>
//       </SignUpContainer>
//     </AppTheme>
//   );
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import { useNavigate } from "react-router-dom";

// ✅ ADDED (spinner + blur)
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [contactError, setContactError] = React.useState(false);
  const [contactErrorMessage, setContactErrorMessage] = React.useState('');

  // ✅ ADDED: loading state
  const [loading, setLoading] = React.useState(false);

  const API = "https://real-estate-27ed.onrender.com/api/users";

  let data = [];

  async function getUsers() {
    try {
      const response = await fetch(API);
      data = await response.json();
      console.log("All users are stored in the array:", data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addUser(email, password, name, contact) {
    try {

      const newUser = {
        name: name,
        email: email,
        password: password,
        contact: contact
      }

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.status === 400) {
        throw new Error("Email already exists");
      }
      alert("User added successfully. You can now sign in.");
    } catch (error) {
      console.error(error);
      alert("Error adding user: " + error.message);
    }
  }

  const navigate = useNavigate();

  const validateInputs = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const name = document.getElementById('name');
      const contact = document.getElementById('contact')

      let isValid = true;
      await getUsers()

      if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }

      if (!password.value || password.value.length < 6) {
        setPasswordError(true);
        setPasswordErrorMessage('Password must be at least 6 characters long.');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      if (!name.value || name.value.length < 1) {
        setNameError(true);
        setNameErrorMessage('Name is required.');
        isValid = false;
      } else {
        setNameError(false);
        setNameErrorMessage('');
      }

      const contactRegex = /^\+[0-9]{4,}$/;

      if (!contact.value || !contactRegex.test(contact.value)) {
        setContactError(true);
        setContactErrorMessage("Contact number must start with + and contain only digits");
      } else {
        setContactError(false);
        setContactErrorMessage("");
      }

      data.forEach(element => {
        if (element.email === email.value) {
          isValid = false;
          setEmailError(true);
          setEmailErrorMessage('Email already exists');
          return;
        }
      });

      if (isValid) {
        await addUser(email.value, password.value, name.value, contact.value);
        console.log("User added successfully");

        const params = new URLSearchParams(window.location.search);
        const destination = params.get("to") || "/SignIn";
        console.log("Navigation to:", destination);
        navigate(destination, { replace: true });
      }

      return isValid;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
      contact: data.get('contact')
    });

  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

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

      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="contact">Contact</FormLabel>
              <TextField
                required
                fullWidth
                id="contact"
                placeholder="+XXX XX XXX XXX"
                name="contact"
                autoComplete="contact"
                variant="outlined"
                error={contactError}
                helperText={contactErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              disabled={loading} // ✅ ADDED (prevents double click)
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="#/SignIn"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
