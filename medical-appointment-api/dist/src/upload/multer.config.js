"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    }),
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new common_1.BadRequestException('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, PDF, DOC, DOCX'), false);
        }
    },
};
//# sourceMappingURL=multer.config.js.map