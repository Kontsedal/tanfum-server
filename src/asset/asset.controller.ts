import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('/api/assets')
export class AssetController {
  constructor(
    private assetsService: AssetService,
    private configService: ConfigService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    const url = await this.assetsService.upload(
      file,
      this.configService.get('S3_IMAGES_BUCKET'),
    );
    return { url };
  }
}
