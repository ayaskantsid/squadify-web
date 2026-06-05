import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const loginDevUser = async () => {

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/dev-token`
    );

    const customToken = response.data.customToken;

    await signInWithCustomToken(
        auth,
        customToken
    );
};