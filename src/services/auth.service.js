import transporter from "../config/mailer.config.js";
import UserRepository from "../repositories/user.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ENVIRONMENT from "../config/environment.config.js";

class AuthService {
    static async register(name, email, password) {
         
        const user_found = await UserRepository.getByEmail(email);
        if (user_found) {
            throw new ServerError(400, 'Email ya en uso');
        }
        
        const password_hashed = await bcrypt.hash(password, 12);
        const user_created = await UserRepository.createUser(name, email, password_hashed);

        const verification_token = jwt.sign({
            email: email,
            user_id: user_created._id
        }, ENVIRONMENT.JWT_SECRET_KEY);

        await transporter.sendMail({
            from: 'lucaskappo22@gmail.com',
            to: email,
            subject: 'Verificación de correo electrónico',
            html: `
                <h1>Hola ${name}</h1>
                <p>Verifica tu correo electrónico:</p>
                <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Verificar email</a>
                <a href='${ENVIRONMENT.URL_FRONTEND}'>Login</a>
            `
                
        });

        
    }

     static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

            await UserRepository.updateById(
                payload.user_id, 
                {
                    verified_email: true
                }
            )

            return 

        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    }


    static async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new ServerError(404, 'Email no registrado');
        } 
        if(user.verified_email=== false){
            throw new ServerError (401, 'Email no verificado')
        }
        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) {
            throw new ServerError(401, 'Contraseña incorrecta');
        }

        const authorization_token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            role:"user"
        }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '1d' });

        return { authorization_token };
    }
      // Enviar correo de recuperación
    static async sendRecoveryEmail(email) {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new ServerError(404, "Email no registrado");

    const recovery_token = jwt.sign(
      { user_id: user._id, email },
      ENVIRONMENT.JWT_SECRET_KEY,
      { expiresIn: "15m" } // dura 15 minutos
    );

    await transporter.sendMail({
      from: "lucaskappo22@gmail.com",
      to: email,
      subject: "Recuperación de cuenta",
      html: `
        <h1>Hola ${user.name}</h1>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${ENVIRONMENT.URL_FRONTEND}/reset-password/${recovery_token}">
          Restablecer contraseña
        </a>
        <p>Este enlace expira en 15 minutos.</p>
      `
    });

    return { message: "Correo de recuperación enviado" };
  }
  // Cambiar contraseña con token
  static async resetPassword(recovery_token, new_password) {
  try {
    const payload = jwt.verify(recovery_token, ENVIRONMENT.JWT_SECRET_KEY);
    const password_hashed = await bcrypt.hash(new_password, 12);

    const user = await UserRepository.updateById(payload.user_id, {
      password: password_hashed,
    });

    if (!user) throw new ServerError(404, "Usuario no encontrado");

    return { message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error("Error en resetPassword:", error);

    if (error instanceof jwt.TokenExpiredError) {
      throw new ServerError(400, "El enlace ha expirado");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ServerError(400, "Token inválido");
    }

    throw new ServerError(500, "Error interno al restablecer contraseña");
  }
}

}

export default AuthService;
