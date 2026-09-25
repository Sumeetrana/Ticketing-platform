export interface AppConfig {
    readonly port: number;
    readonly nodeEnv: string;
    readonly databaseUrl: string;
    readonly directDatabaseUrl: string;
    readonly jwtSecret: string;
}

function toInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export default (): AppConfig => ({
    port: toInt(process.env['PORT'], 3002),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    databaseUrl: process.env['DATABASE_URL'] || '',
    directDatabaseUrl: process.env['DIRECT_DATABASE_URL'] || '',
    jwtSecret: process.env['JWT_SECRET'] || ''
})