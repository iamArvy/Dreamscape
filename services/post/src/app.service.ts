import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './app.schema';
import { Model, UpdateQuery } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Post.name)
    private model: Model<PostDocument>,
    private prisma: PrismaService,
  ) {}

  async create(
    user: { id: string; name: string; avatar: string | null },
    data: { content: string; media: string[] },
    pid?: string,
  ) {
    const post = await this.model.create({
      author_id: user.id,
      author_username: user.name,
      author_avatar: user.avatar,
      content: data.content,
      media: data.media,
      parent_id: pid,
    });

    return post;
  }

  async comment(
    user: { id: string; name: string; avatar: string | null },
    data: { content: string; media: string[] },
    pid: string,
  ) {
    const parent = await this.get(pid);
    const comment = await this.create(user, data, pid);
    await this.prisma.comment.create({
      data: { parent_post: pid, child_post: comment._id as string },
    });
    parent.child_count++;
    await parent.save();
    return comment;
  }

  async user_like_post(uid: string, pid: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        post_id_user_id: {
          post_id: pid,
          user_id: uid,
        },
      },
    });
    if (like) return true;
    return false;
  }

  async user_view_post(uid: string, pid: string) {
    const view = await this.prisma.view.findUnique({
      where: {
        post_id_user_id: {
          post_id: pid,
          user_id: uid,
        },
      },
    });
    if (view) return true;
    return false;
  }

  async like_post(uid: string, pid: string) {
    const post = await this.get(pid);
    if (await this.user_like_post(uid, pid))
      throw new BadRequestException('User already liked post');

    await this.prisma.like.create({
      data: {
        user: { connect: { user_id: uid } },
        post_id: pid,
      },
    });
    post.like_count++;
    await post.save();
    return post;
  }

  async unlike_post(uid: string, pid: string) {
    const post = await this.get(pid);
    if (!(await this.user_like_post(uid, pid)))
      throw new BadRequestException('User has not liked this post');

    await this.prisma.like.delete({
      where: {
        post_id_user_id: {
          post_id: pid,
          user_id: uid,
        },
      },
    });
    post.like_count--;
    await post.save();
    return post;
  }

  async get(pid) {
    const post = await this.model.findById(pid);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async get_user_post(uid, pid) {
    const post = await this.model.findOne({
      author_id: uid,
      _id: pid,
    });
    if (!post) throw new NotFoundException('Post not found for user');
    return post;
  }

  async get_user_posts(uid) {
    const posts = await this.model.find({
      author_id: uid,
    });
    return posts;
  }

  async get_post_comments(pid: string) {
    const comments = await this.prisma.comment.findMany({
      where: { parent_post: pid },
    });

    const postsIds = comments.map((comment) => comment.child_post);
    return this.model.find({
      _id: { $in: postsIds },
    });
  }

  async update(pid, data: UpdateQuery<PostDocument>) {
    const post = await this.model.findByIdAndUpdate(pid, data);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  delete(id: string) {
    return `This action removes a #${id} post`;
  }
}
