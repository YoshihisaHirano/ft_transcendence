import type { GameStats, Tournament } from "$lib/types/types";
import { addContentType, baseUrl, unauthorizedCode } from "./settings";
import userService from './userService';

const endpoint = 'tournament/';
const baseUrlWithEndpoint = new URL(endpoint, baseUrl);

export default {
    getTournament: async (): Promise<Tournament[]> => {
        try {
            const res = await fetch(baseUrlWithEndpoint);
            return res.json();
        } catch (error) {
            // console.error(error);
            return [];
        }
    },

    sendGameResult: async (stats: GameStats): Promise<void> => {
        try {
            const res = await fetch(new URL('stats/create', baseUrl), {
                method: 'POST',
                headers: {
                    ...addContentType()
                },
                body: JSON.stringify(stats)
            });
            if (res.status === 401) {
                await userService.logout();
            }
        } catch (error) {
            if ((error as Error).message === unauthorizedCode) {
                userService.logout();
            }
        }
    }
}