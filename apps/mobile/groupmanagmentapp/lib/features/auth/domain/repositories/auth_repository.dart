import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> login({required String email, required String password});
  Future<void> logout();
  // Puedes agregar más métodos como register, refreshToken, etc.
}
