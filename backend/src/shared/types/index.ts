// the payload we embed inside JWTs
export interface AuthUser {
    id: string;
    email: string;
}


// new: I am telling Typescript that  express Request has a 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}