export interface User { id:string; email:string; firstName:string; lastName?:string|null; roles:string[]; }
export interface AuthResponse { accessToken:string; refreshToken:string; tokenType:string; user:User; }
