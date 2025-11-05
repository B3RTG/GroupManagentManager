import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> login({required String email, required String password});
  Future<void> logout();
  Future<User> loginWithGoogle({required String idToken});
  Future<User> registerWithGoogle({required String idToken});
  Future<User> register({required String email, required String name, required String password});
  // Puedes agregar más métodos como refreshToken, etc.
}
