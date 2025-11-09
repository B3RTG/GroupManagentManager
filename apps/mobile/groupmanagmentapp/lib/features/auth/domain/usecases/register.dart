import 'package:groupmanagmentapp/features/auth/domain/entities/user.dart';
import 'package:groupmanagmentapp/features/auth/domain/repositories/auth_repository.dart';

class Register {
  final AuthRepository repository;

  Register(this.repository);

  Future<User> call({required String email, required String name, required String password}) {
    return repository.register(email: email, name: name, password: password);
  }
}
