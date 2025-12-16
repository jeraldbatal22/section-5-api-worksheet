import type { CreateUserDTO, LoginDTO } from "../dto/auth.dto.ts";
import UserRepository from "../repositories/user.repository.ts";

class AuthService {
  async register(userData: CreateUserDTO): Promise<any> {
    await UserRepository.signupWithPassword(
      userData.username,
      userData.password
    );
  }

  async login(loginData: LoginDTO): Promise<any> {
    const { user, session } = await UserRepository.signin(
      loginData.username,
      loginData.password
    );

    return {
      user,
      token: session.access_token,
    };
  }

  async getUsers(): Promise<any[]> {
    const users = await UserRepository.findAllUsers();
    return users;
  }
}

export default new AuthService();
