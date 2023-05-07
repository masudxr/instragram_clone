import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(file: Express.Multer.File): Promise<string> {
    const originalName: string = path.parse(file.originalname).name;
    const filename = originalName + '.jpg';

    await sharp(file.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(path.join('uploads', filename));

    return filename;
  }
}

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
