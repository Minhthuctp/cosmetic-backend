import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Blog, BlogSchema } from 'src/schemas/blog.schema';
import { BlogController } from './blog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
