import { Role, User } from '@prisma/client'
import { DefaultSession } from 'next-auth'

export type ExtendUser = DefaultSession['user'] & {
    role: Role,
    id: User.sub
}



declare module 'next-auth' {
    interface Session {
        user: ExtendUser
    }
}