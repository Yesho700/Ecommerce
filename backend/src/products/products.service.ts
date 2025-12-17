import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly cloudinary: CloudinaryService
  ) {}

  async findAll(): Promise<Product[]> {
    const docs = await this.productModel.find().sort({ createdAt: -1 }).lean<Product[]>();
    const signed = await Promise.all(docs.map((p) => this.withSignedMedia(p)));
    return signed;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean<Product>();
    if (!product) throw new NotFoundException("Product not found");
    return this.withSignedMedia(product);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException("Product not found");
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.productModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException("Product not found");
  }

  private async withSignedMedia<T extends { images?: string[]; videos?: string[] }>(p: T): Promise<T> {
    const sign = async (val: string, fallbackType: "image" | "video") => {
      if (!val) return val;
      const isUrl = /^https?:\/\//i.test(val);
      if (!isUrl) {
        return this.cloudinary.signedReadUrl(val, fallbackType);
      }
      if (/res\.cloudinary\.com/.test(val)) {
        const m = val.match(/\/(image|video)\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+(?:\?|$)/i);
        if (m) {
          const resource = (m[1] as "image" | "video") || fallbackType;
          const publicId = m[2];
          return this.cloudinary.signedReadUrl(publicId, resource);
        }
      }
      return val;
    };
    const images = await Promise.all((p.images || []).map((i) => sign(i, "image")));
    const videos = await Promise.all((p.videos || []).map((v) => sign(v, "video")));
    return { ...p, images, videos };
  }
}
