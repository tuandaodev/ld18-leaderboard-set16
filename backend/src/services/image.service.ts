import multer from 'multer';
import * as path from 'path';

export function getImageDirPath() {
    return path.join(__dirname, '..', '..', '..', 'public', 'images');
}

export function getImagePath(name: string, type: string) {
    const publicFolderPath = getImageDirPath();
    return path.join(publicFolderPath, `${name}.${type}`);
}

export function getExtension(filename: string) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

export const sharedMulterOptions: multer.Options = { 
  dest: 'uploads/',
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Chỉ hỗ trợ các định dạng ${ALLOWED_IMAGE_TYPES.join(', ')}!`));
    }
  }
}

export const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
export const ALLOWED_IMAGE_TYPES = Array.from(ALLOWED_EXTENSIONS).map(extension => `image/${extension}`);