import { Module } from '@nestjs/common';
import {FilesService} from './files.service';
import PublicFile from './publicFile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([PublicFile])],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule {}