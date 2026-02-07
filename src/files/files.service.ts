import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './publicFile.entity'
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(PublicFile)
        private readonly publicFileRepository: Repository<PublicFile>,
        private readonly configService: ConfigService,
    ) {}

    async uploadPublicFile(dataBuffer: Buffer, filename: string){
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: `${uuidv4()}-${filename}`,
            Body: dataBuffer,
        }).promise();

        const newFile = this.publicFileRepository.create({
            url: uploadResult.Location,
            key: uploadResult.Key,
        });
        await this.publicFileRepository.save(newFile);
        return newFile;
    }
    async deletePublicFile(fileId: number){
        const file = await this.publicFileRepository.findOne({ where: { id: fileId } });
        const s3 = new S3();
        await s3.deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: file.key,
        }).promise();
        await this.publicFileRepository.remove(file);
    }
}