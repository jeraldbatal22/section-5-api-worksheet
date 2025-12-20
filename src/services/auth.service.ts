import UserRepository from '../repositories/user.repository';
import { T_LoginInput, T_RegisterInput } from '../schemas/user.schema';

class AuthService {
  async register(userData: T_RegisterInput): Promise<any> {
    await UserRepository.signupWithPassword(userData.username, userData.password);
  }

  async login(loginData: T_LoginInput): Promise<any> {
    const { user, session } = await UserRepository.signin(loginData.username, loginData.password);
    return {
      user,
      token: session.access_token,
    };
  }

  async getUsers(): Promise<any[]> {
    const users = await UserRepository.findAllUsers();
    return users;
  }

  async findUser(id: string): Promise<any> {
    const user = await UserRepository.findById(id);
    return user;
  }
}

export default new AuthService();
