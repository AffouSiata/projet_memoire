import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: "MEDECIN";
            statutValidation: "PENDING";
        };
        requiresApproval: boolean;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
            statutValidation: import("@prisma/client").$Enums.StatutValidation | null;
        };
        message?: undefined;
        requiresApproval?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
}
