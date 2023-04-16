export const DEFAULT_FIELD_HEIGHT = 400;
export const DEFAULT_FIELD_WIDTH = 800;

interface GameSettings {
    bgCol: string;
    emoji: string;
    paddleLength: number;
    ballRadius: number;
    ballSpeed: number;
}

export const gameModes: { [key: string]: GameSettings } = {
    easy: {
        emoji: '👶',
        bgCol: '#460261',
        paddleLength: 2.5,
        ballRadius: 21,
        ballSpeed: 6,
    },
    default: {
        emoji: '🤓',
        bgCol: '#050609',
        paddleLength: 3,
        ballRadius: 17,
        ballSpeed: 8,
    },
    hard: {
        emoji: '😈',
        bgCol: '#8f040b',
        paddleLength: 3.5,
        ballRadius: 15,
        ballSpeed: 10,
    }
}