
import 'package:groupmanagmentapp/features/auth/domain/entities/user.dart';
import 'package:groupmanagmentapp/features/auth/domain/repositories/auth_repository.dart';

class RegisterWithGoogle {
  final AuthRepository repository;

  RegisterWithGoogle(this.repository);

  Future<User> call({required String idToken}) {
    return repository.registerWithGoogle(idToken: idToken);
  }
}