import type { Tournament } from "$lib/types/types";
import { baseUrl } from "./settings";

const endpoint = 'tournament/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);

export default {
    getTournament: async (): Promise<Tournament[]> => {
        try {
            const res = await fetch(baseUrlWithEndpoint);
            return res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}