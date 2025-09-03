import { ImageDAO } from "../interfaces/ImageDAO";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3ImageDAO implements ImageDAO{
   
    readonly bucketName = "cooper-tweeter-images";

 

    async putImage(filename: string, image: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: "images/" + filename,
            Body: Buffer.from(image, 'base64'),
            ContentType: 'image/png'
        };

        try {
            const command = new PutObjectCommand(params);
            const client = new S3Client({ region: "us-west-2" });
            await client.send(command);
            return `https://${this.bucketName}.s3.amazonaws.com/images/${filename}`;
        } catch (error) {
            console.error("Error uploading image ${} to S3 because:", error);
            throw new Error(`didn't upload to ${this.bucketName}: ${filename}. ${error}, the params where: ${params}`);
        }
    }

}