"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ImageDAO = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3ImageDAO {
    bucketName = "cooper-tweeter-images";
    async putImage(filename, image) {
        const params = {
            Bucket: this.bucketName,
            Key: "images/" + filename,
            Body: Buffer.from(image, 'base64'),
            ContentType: 'image/png'
        };
        try {
            const command = new client_s3_1.PutObjectCommand(params);
            const client = new client_s3_1.S3Client({ region: "us-west-2" });
            await client.send(command);
            return `https://${this.bucketName}.s3.amazonaws.com/images/${filename}`;
        }
        catch (error) {
            console.error("Error uploading image ${} to S3 because:", error);
            throw new Error(`didn't upload to ${this.bucketName}: ${filename}. ${error}, the params where: ${params}`);
        }
    }
}
exports.S3ImageDAO = S3ImageDAO;
