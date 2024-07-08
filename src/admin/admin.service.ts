import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService
    ){ }

    async getAdmin(){
        try {
            const admin  =  await this.prisma.admin.findMany({
                where:{
                    isActive: true
                }
            });
            return admin;
        } catch (error) {
            console.error(error);

        }
    }

    async addAdmin(full_name: string, lastName: string){
        try {
            const add =  await this.prisma.admin.create({
                data:{
                    full_name:full_name,
                    last_name: lastName
                }
            });
            return add;
        } catch (error) {
            console.error(error)
        }
    }

    async updateAdmin(fullName: string){
   try {
     const update =  await this.prisma.admin.updateMany({
        where:{
            full_name:fullName
        },data:{
          last_name: "Vikash"
        }
     });
      return update;
   } catch (error) {
    
   }
    }

    async delete(fullName: string){
        try {
          const update =  await this.prisma.admin.updateMany({
             where:{
                 full_name:fullName
             },data:{
                isActive: false
             }
          });
           return update;
        } catch (error) {
          console.error(error)
        }
         }
    

}
