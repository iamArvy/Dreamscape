import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UseGuards } from '@nestjs/common';
import { Post } from './app.entity';
import { GqlAuthGuard } from './guards';
import { CreatePostInput } from './app.input';

@Resolver()
export class AppResolver {
  constructor(
    private readonly service: AppService,
    private readonly userService: UserService,
  ) {}

  @Query(() => String)
  health(): string {
    return 'OK';
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'create' })
  async create_post(
    @Context() req: { user: string },
    @Args('data') data: CreatePostInput,
  ) {
    const user = await this.userService.user(req.user);
    const post = this.service.create(user, data);
    return post;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'comment' })
  async create_comment(
    @Context() req: { user: string },
    @Args('id') pid: string,
    @Args('data') data: CreatePostInput,
  ) {
    const user = await this.userService.user(req.user);
    const post = await this.service.comment(user, data, pid);
    return post;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'like_post' })
  async like_post(@Context() req: { user: string }, @Args('id') id: string) {
    await this.service.like_post(req.user, id);
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'unlike_post' })
  async unlike_post(@Context() req: { user: string }, @Args('id') id: string) {
    await this.service.unlike_post(req.user, id);
    return true;
  }

  @Query(() => Post, { name: 'get_post' })
  get_post(@Args('id') id: string) {
    return this.service.get(id);
  }

  @Query(() => [Post], { name: 'get_user_posts' })
  get_user_post(@Args('id') id: string) {
    return this.service.get_user_posts(id);
  }

  @Query(() => [Post], { name: 'get_post_children' })
  async get_post_children(@Args('id') id: string) {
    return await this.service.get_post_comments(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'update_post' })
  async update_post(
    @Context() req: { user: string },
    @Args('id') id: string,
    @Args('data') data: CreatePostInput,
  ) {
    const post = await this.service.get_user_post(req.user, id);
    await post.updateOne(data);
    await post.save();
    return post;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'delete_post' })
  async delete_post(@Context() req: { user: string }, @Args('id') id: string) {
    const post = await this.service.get_user_post(req.user, id);
    await post.deleteOne();
    return post;
  }
}
