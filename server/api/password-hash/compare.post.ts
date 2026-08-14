import { createError, defineEventHandler, readBody, setHeader } from 'h3';

import { compareHashResponse } from '~~/server/utils/password-hash-tester';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');

  try {
    return await compareHashResponse(await readBody(event));
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error
        ? error.message
        : '해시를 비교하지 못했습니다.',
    });
  }
});
