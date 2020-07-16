import * as jwt from 'jsonwebtoken'

export class Authenticator {
    private static EXPIRES_IN = "2y"
    
    public generateToken(input: AuthenticationData, expiresIn: string =  process.env.ACCESS_TOKEN_EXPIRES_IN as string): string {
        const token = jwt.sign(
            {
                id: input.id,
                role: input.role,
                device: input.device
            },
            process.env.JWT_KEY as string,
            {
                expiresIn: Authenticator.EXPIRES_IN
            }
        )
        return token
    }

    public getData(token: string): AuthenticationData {
        const payload = jwt.verify(token, process.env.JWT_KEY as string) as any
        const result = {
            id: payload.id
        }
        return result
    }
}

interface AuthenticationData {
    id: string;
    role?: string;
    device?: string;
}