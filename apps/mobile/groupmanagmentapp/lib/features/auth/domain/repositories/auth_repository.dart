import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> login({required String email, required String password});
  Future<void> logout();
  Future<User> loginWithGoogle({required String idToken});
  // Puedes agregar más métodos como register, refreshToken, etc.
}
