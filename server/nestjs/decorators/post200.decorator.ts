import { applyDecorators, HttpCode, Post } from '@nestjs/common';

export function Post200(path?: string | string[]) {
  return applyDecorators(
    Post(path),
    HttpCode(200)
  );
}