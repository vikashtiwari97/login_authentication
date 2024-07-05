import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

    constructor(private authservice: AuthService) { }

    @Post("/local/signup")
    signupLocal(@Body() dto: AuthDTO): Promise<Tokens>{
        return this.authservice.signupLocal(dto);
    }

    @Post("/local/sigin")
    signinLocal(@Body() dto: AuthDTO): Promise<Tokens>{
        return this.authservice.signinLocal(dto);
    }

    @Post("/logout")
    logOut(){
        this.authservice.logOut();
    }

    @Post("/refresh")
    refreshtokens(){
        this.authservice.refreshtokens(); 
    }
}
