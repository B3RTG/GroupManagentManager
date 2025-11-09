import 'package:groupmanagmentapp/features/auth/domain/entities/user.dart';
import 'package:groupmanagmentapp/features/auth/domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
//import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<User> login({required String email, required String password}) async {
    final authResponse = await remoteDataSource.login(
      email: email,
      password: password,
    );
    // Convertir UserModel a User (entidad de dominio)
    final userModel = authResponse.user;

    return User(
      id: userModel.id,
      name: userModel.name,
      username: userModel.username,
      email: userModel.email,
      preferredSports: userModel.preferredSports,
      avatarUrl: userModel.avatarUrl,
      phoneNumber: userModel.phoneNumber,
      isActive: userModel.isActive,
      lastLogin: userModel.lastLogin,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      token: authResponse.token,
    );
  }

  @override
  Future<void> logout() async {
    await remoteDataSource.logout();
  }

  @override
  Future<User> loginWithGoogle({required String idToken}) async {
    final authResponse = await remoteDataSource.loginWithGoogle(
      idToken: idToken,
    );
    // Convertir UserModel a User (entidad de dominio)
    final userModel = authResponse.user;
    return User(
      id: userModel.id,
      name: userModel.name,
      username: userModel.username,
      email: userModel.email,
      preferredSports: userModel.preferredSports,
      avatarUrl: userModel.avatarUrl,
      phoneNumber: userModel.phoneNumber,
      isActive: userModel.isActive,
      lastLogin: userModel.lastLogin,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      token: authResponse.token,
    );
  }

  @override
  Future<User> registerWithGoogle({required String idToken}) async {
    final authResponse = await remoteDataSource.registerWithGoogle(
      idToken: idToken,
    );
    // Convertir UserModel a User (entidad de dominio)
    final userModel = authResponse.user;
    return User(
      id: userModel.id,
      name: userModel.name,
      username: userModel.username,
      email: userModel.email,
      preferredSports: userModel.preferredSports,
      avatarUrl: userModel.avatarUrl,
      phoneNumber: userModel.phoneNumber,
      isActive: userModel.isActive,
      lastLogin: userModel.lastLogin,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      token: authResponse.token,
    );

  }

  @override
  Future<User> register({required String email, required String name, required String password}) async {
    final authResponse = await remoteDataSource.register(
      email: email,
      name: name,
      username: name,
      password: password,
    );
    final userModel = authResponse.user;
    return User(
      id: userModel.id,
      name: userModel.name,
      username: userModel.username,
      email: userModel.email,
      preferredSports: userModel.preferredSports,
      avatarUrl: userModel.avatarUrl,
      phoneNumber: userModel.phoneNumber,
      isActive: userModel.isActive,
      lastLogin: userModel.lastLogin,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      token: authResponse.token,
    );
  }

  @override
  Future<User> loginWithToken(String token) async {
    final authResponse = await remoteDataSource.loginWithToken(token);
    final userModel = authResponse.user;
    return User(
      id: userModel.id,
      name: userModel.name,
      username: userModel.username,
      email: userModel.email,
      preferredSports: userModel.preferredSports,
      avatarUrl: userModel.avatarUrl,
      phoneNumber: userModel.phoneNumber,
      isActive: userModel.isActive,
      lastLogin: userModel.lastLogin,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      token: token
    );  
  }
}