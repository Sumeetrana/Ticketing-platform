export interface AppConfig {
    readonly port: number;
    readonly nodeEnv: string;
}

function toInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export default (): AppConfig => ({
    port: toInt(process.env['PORT'], 3001),
    nodeEnv: process.env['NODE_ENV'] || 'development'
})