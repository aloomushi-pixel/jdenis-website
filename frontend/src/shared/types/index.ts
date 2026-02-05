// Shared Types
// Domain types used across the application

export type UserRole =
    | 'ADMIN'
    | 'TRANSPORTISTA'
    | 'ALMACEN_MATERIA_PRIMA'
    | 'ALMACEN_PRODUCTO_FINAL'
    | 'FABRICA'
    | 'EJECUTIVO'
    | 'CLIENTE';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    error: string;
    details?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
