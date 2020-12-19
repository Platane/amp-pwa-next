const re = new RegExp(process.env.APP_AMP_PAGE_REGEXP!);

export const isAmpPage = (pathname: string) => pathname?.match(re);
