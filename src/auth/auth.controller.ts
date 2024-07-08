import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private authservice: AuthService) { }

    @Post("/local/signup")
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDTO): Promise<Tokens>{
        return this.authservice.signupLocal(dto);
    }

    @Post("/local/sigin")
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDTO): Promise<Tokens>{
        return this.authservice.signinLocal(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logOut(@Req() req: Request){
        const user = req.user;
       return this.authservice.logOut(user['email']);
    }


    @UseGuards(AuthGuard('jwt-refresh'))
    @Post("/refresh")
    @HttpCode(HttpStatus.OK)
    refreshtokens(@Req() req: Request){
        const user = req.user;
        return this.authservice.refreshtokens(user['id'], user['refreshToken']); 
    }
}
