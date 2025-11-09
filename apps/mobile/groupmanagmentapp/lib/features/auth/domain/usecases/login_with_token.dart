import '../repositories/auth_repository.dart';
import '../entities/user.dart';

class LoginWithToken {
  final AuthRepository repository;
  LoginWithToken(this.repository);

  Future<User> call({required String token}) async {
    return await repository.loginWithToken(token);
  }
}
