import { UserService } from './user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { PostResponse } from './app.response';
import { CreatePostInput } from './app.input';
import { AppService } from './app.service';

@Controller('post')
export class AppController {
  constructor(
    private readonly service: AppService,
    private readonly userService: UserService,
  ) {}

  @ApiOkResponse({ description: 'The created post', type: PostResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('create')
  async create_post(
    @Req() req: { user: string },
    @Body() data: CreatePostInput,
  ) {
    const user = await this.userService.user(req.user);
    const post = this.service.create(user, data);
    return post;
  }

  @ApiOkResponse({ description: 'The created comment', type: PostResponse })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/comment')
  async create_comment(
    @Req() req: { user: string },
    @Param('id') pid: string,
    @Body() data: CreatePostInput,
  ) {
    const user = await this.userService.user(req.user);
    const post = await this.service.comment(user, data, pid);
    return post;
  }
  @ApiOkResponse({ description: 'True or False response', type: Boolean })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like_post(@Req() req: { user: string }, @Param('id') id: string) {
    await this.service.like_post(req.user, id);
    return true;
  }

  @ApiOkResponse({ description: 'True or False response', type: Boolean })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlike_post(@Req() req: { user: string }, @Param('id') id: string) {
    await this.service.unlike_post(req.user, id);
    return true;
  }

  @ApiOkResponse({ description: 'The requested post', type: PostResponse })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @Get(':id')
  get_post(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiOkResponse({
    description: 'An array of the user post',
    type: [PostResponse],
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '6824a37849a58974adbaa5d4',
  })
  @Get('user/:id')
  get_user_post(@Param('id') id: string) {
    return this.service.get_user_posts(id);
  }

  @ApiOkResponse({
    description: 'An array of the post children',
    type: [PostResponse],
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @Get(':id/comments')
  async get_post_children(@Param('id') id: string) {
    return await this.service.get_post_comments(id);
  }

  @ApiOkResponse({ description: 'The updated post', type: PostResponse })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/update')
  async update_post(
    @Req() req: { user: string },
    @Param('id') id: string,
    @Body() data: CreatePostInput,
  ) {
    const post = await this.service.get_user_post(req.user, id);
    await post.updateOne(data);
    await post.save();
    return post;
  }

  @ApiOkResponse({ description: 'The deleted post', type: PostResponse })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  async delete_post(@Req() req: { user: string }, @Param('id') id: string) {
    const post = await this.service.get_user_post(req.user, id);
    await post.deleteOne();
    return post;
  }
}
