export interface JwtPayload {
    id: string;
    iat?: number; // tiempo de expiracion
    exp?: number; // fecha de expiracion
}