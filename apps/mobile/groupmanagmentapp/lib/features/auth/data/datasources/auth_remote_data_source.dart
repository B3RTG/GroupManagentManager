import 'package:dio/dio.dart';
import 'package:groupmanagmentapp/core/network/api_client.dart';
import '../models/user_model.dart';

class AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSource(this.apiClient);

  Future<AuthResponseModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await apiClient.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return AuthResponseModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Login failed: \\${e.message}');
    }
  }

  Future<void> logout() async {
    try {
      await apiClient.post('/auth/logout');
    } on DioException catch (e) {
      throw Exception('Logout failed: \\${e.message}');
    }
  }

  Future<AuthResponseModel> loginWithGoogle({required String idToken}) async {
    try {
      final response = await apiClient.post(
        '/auth/google/mobile',
        data: {'idToken': idToken},
      );
      return AuthResponseModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Google login failed: \\${e.message}');
    }
  }
}
