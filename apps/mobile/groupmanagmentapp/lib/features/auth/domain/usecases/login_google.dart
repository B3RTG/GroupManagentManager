import 'package:groupmanagmentapp/features/auth/domain/entities/user.dart';
import 'package:groupmanagmentapp/features/auth/domain/repositories/auth_repository.dart';

class LoginWithGoogle {
  final AuthRepository repository;

  LoginWithGoogle(this.repository);

  Future<User> call({required String idToken}) {
    return repository.loginWithGoogle(idToken: idToken);
  }
}
