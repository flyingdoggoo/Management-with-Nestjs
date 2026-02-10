import { LocalStrategy } from "./strategy/local.strategy";
import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { AuthenticationController } from "./authentication.controller";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";
@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            }),
        }),
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
    exports: [AuthenticationService],
})
export class AuthenticationModule {} 