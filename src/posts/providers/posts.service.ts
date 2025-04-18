import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';

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

    /**
     * Injecting tags Service
     */
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Creating new post
   */
  public async create(@Body() createPostDto: CreatePostDto) {
    //Find author from database based on authorId

    const author = await this.userService.findOneById(createPostDto.authorId);

    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

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
      metaOptions: createPostDto.metaOptions || undefined,
      author: author || undefined,
      tags: tags,
    });

    // Return the post
    return await this.postRepository.save(post);
  }

  public async update(@Body() patchPostdto: PatchPostDto) {
    let tags = undefined as Tag[] | undefined;
    let post = null as Post | null;
    //Find the tag
    try {
      tags = await this.tagsService.findMultipleTags(patchPostdto.tags ?? []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
      );
    }

    /**
     * Number of tags need to be equal
     */
    if (!tags || tags.length !== patchPostdto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    //Find the post
    try {
      post = await this.postRepository.findOneBy({
        id: patchPostdto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
      );
    }

    //Update the properties
    if (post) {
      post.title = patchPostdto.title ?? post?.title;
      post.content = patchPostdto.content ?? post.content;
      post.status = patchPostdto.status ?? post.status;
      post.postType = patchPostdto.postType ?? post.postType;
      post.slug = patchPostdto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostdto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostdto.publishOn ?? post.publishOn;

      //Assign the new tags
      post.tags = tags;
    } else {
      throw new BadRequestException('The post ID does not exist');
    }

    //Save the post and return
    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
      );
    }
    return post;
  }

  public async findAll(userId: string) {
    //Find A User
    // const user = this.userService.findOneById(userId);

    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        // author: true,
        // tags: true,
      },
    });
    return posts;
  }

  public async delete(id: number) {
    //Find the post
    // const post = await this.postRepository.findOneBy({ id });

    //Delete the post
    await this.postRepository.delete(id);

    // if (post?.metaOptions) {
    //   //Delete the meta options
    //   // await this.metaOptionRepository.delete(post.metaOptions.id);

    //   const inversePost = await this.metaOptionRepository.find({
    //     where: { id: post?.metaOptions.id },
    //     relations: {
    //       post: true,
    //     },
    //   });
    //   console.log(inversePost);
    // }

    //confirmation
    return { deleted: true, id };
  }
}
