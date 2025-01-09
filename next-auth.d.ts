import { Role, User } from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'

export type ExtendUser = DefaultSession['user'] & {
    role:   "USER" | "WRITTER" | "ADMIN",
    
}



declare module 'next-auth' {
    interface Session {
        user: ExtendUser
    }
}

import {JWT} from 'next-auth/jwt'

declare module "next-auth/jwt" {
    interface JWT {
        role?:  "USER" | "WRITTER" | "ADMIN",
        id: string
    }
}