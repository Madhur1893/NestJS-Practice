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
    // Create the metaOptions first if they exist
    // const metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionRepository.create(createPostDto.metaOptions)
    //   : null;
    // if (metaOptions) {
    //   await this.metaOptionRepository.save(metaOptions);
    // }
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
      // metaOptions: createPostDto.metaOptions,
    });

    // Add metaOptions to the post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }
    // Return the post
    return await this.postRepository.save(post);
  }

  public findAll(userId: string) {
    //Find A User
    const user = this.userService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test File',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test File 2',
        content: 'Test Content 2',
      },
    ];
  }
}
