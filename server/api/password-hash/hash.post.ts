import { createError, defineEventHandler, readBody, setHeader } from 'h3';

import { createHashResponse } from '~~/server/utils/password-hash-tester';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');

  try {
    return await createHashResponse(await readBody(event));
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error
        ? error.message
        : '해시를 생성하지 못했습니다.',
    });
  }
});
