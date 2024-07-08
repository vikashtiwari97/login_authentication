import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private AdminService: AdminService){}

    @Get()
    async getAdmin(){
        return this.AdminService.getAdmin();
    }

    
    @Post('add')
    async addAdmin(@Body('full_name') fullName: string, @Body('last_name') lastName: string) {
        return this.AdminService.addAdmin(fullName, lastName);
    }

    @Patch("update")
    async updateAdmin(@Body('full_name') fullName: string, ){
        return this.AdminService.updateAdmin(fullName);
    }

    @Patch("delete")
    async delete(@Body('full_name') fullName: string, ){
        return this.AdminService.delete(fullName);
    }

}
