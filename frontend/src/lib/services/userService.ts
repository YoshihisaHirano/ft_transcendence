import type { User } from "$lib/types/types";
import { baseUrl } from "./settings";

const endpoint = 'users/';
const url = new URL(endpoint, baseUrl);

export default {
    getUserById: async (userId: string): Promise<User | null> => {
        try {
            const res = await fetch(new URL(userId, url));
            return res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}