export abstract class ImageDAO {
    abstract putImage(filenam: string, image: string): Promise<string>;
}