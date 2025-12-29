import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useAuth, useName } from '../../authentication';

export default function Profile() {
    const { isSignedIn } = useAuth();
    const { name } = useName();
    if (isSignedIn) {
        return (<Typography color="primary" fontWeight={600}>
            {name}
        </Typography>)
    }
    else {
        return (
            <>
                <Button color="primary" variant="text" size="small">
                    <Link
                        href="/SignIn"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Sign in
                    </Link>
                </Button>
                <Button color="primary" variant="text" size="small">
                    <Link
                        href="/SignUp"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                        Sign up
                    </Link>
                </Button>
            </>

        )
    }
}