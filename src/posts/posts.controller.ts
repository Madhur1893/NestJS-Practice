import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: '201 response if your post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
