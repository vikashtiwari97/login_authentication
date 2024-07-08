import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService
        , private jwtService : JwtService
    ){ }

    hashData(data:string){
        return bcrypt.hash(data,10);
    }

    async getTokens(userId: number, email: string): Promise<Tokens>{
        const [at,rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            },
            {
                secret:'at-secret',
                expiresIn: 60*15,
            }
        ),
        this.jwtService.signAsync(
            {
                sub:userId,
                email,
            },
            {
                secret: 'rt-secret',
                expiresIn: 60*60*24*7,
            }
        )
        ]);
        return{
            access_token:at,
            refresh_token:rt,
        }
    }

    async signupLocal(dto : AuthDTO): Promise<Tokens>{
        
        const {password , ...restdto}= dto;
        const hash = await this.hashData(password);
        const newUser = await this.prisma.user.create({
            data:{
                ...restdto,
                hash :hash ,
            },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens;
    }

    async updateRtHash(userId: number, rt: string){
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where:{
                id: userId,
            },
            data: {
                hashedRT: hash,
            }
        })
    } 

    async signinLocal(dto: AuthDTO): Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email         
            },
        });
        if (!user) throw new ForbiddenException("Access Denied");

        const passwordMatch = await bcrypt.compare(dto.password, user.hash);
        if (!passwordMatch) throw new ForbiddenException('Access Denied');
    
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    
    }   

    async logOut(email:string){
        await this.prisma.user.update({
            where:{
                email:email,
                hashedRT:{
                    not: null,
                },
            },
            data:{
                hashedRT: null
            }
        })
        
    }

    async refreshtokens(userId: number, rt: string){ 
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) throw new ForbiddenException("Access Denied");
        const rtMatches = await bcrypt.compare(rt, user.hashedRT) 
        if(!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

}
