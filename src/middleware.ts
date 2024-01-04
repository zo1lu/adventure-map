export {default} from 'next-auth/middleware';
export const config = { matcher:["/home","/map/:path","/explore/map/:path"] }