import { Body, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting user Service
     */
    private readonly userService: UserService,

    /**
     *  Injecting post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     *  Injecting metaOption repository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  /**
   * Creating new post
   */
  public async create(@Body() createPostDto: CreatePostDto) {
    // Create Post
    const post = this.postRepository.create({
      title: createPostDto.title,
      postType: createPostDto.postType,
      slug: createPostDto.slug,
      status: createPostDto.status,
      content: createPostDto.content,
      schema: createPostDto.schema,
      featuredImageUrl: createPostDto.featuredImageUrl,
      publishOn: createPostDto.publishOn,
    });

    // Return the post
    return await this.postRepository.save(post);
  }

  public async findAll(userId: string) {
    //Find A User
    const user = this.userService.findOneById(userId);

    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
      },
    });
    return posts;
  }

  public async delete(id: number) {
    //Find the post
    const post = await this.postRepository.findOneBy({ id });

    //Delete the post
    await this.postRepository.delete(id);

    if (post?.metaOptions) {
      //Delete the meta options
      await this.metaOptionRepository.delete(post.metaOptions.id);
    }

    //confirmation
    return { deleted: true, id };
  }
}
