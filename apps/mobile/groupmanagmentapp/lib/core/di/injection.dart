import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/login_google.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/register.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/register_google.dart';
import '../network/api_client.dart';
import '../services/google_sign_in_service.dart';
import '../../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../../features/auth/domain/usecases/login.dart';
import '../../../features/auth/domain/usecases/logout.dart';
import '../../../features/auth/presentation/bloc/auth_bloc.dart';
import 'dart:io';

final getIt = GetIt.instance;

Future<void> configureDependencies() async {
  // Detectar plataforma y asignar la URL base adecuada
  String baseUrl = 'http://localhost:3000';
  if (!kIsWeb && Platform.isAndroid) {
    baseUrl = 'http://192.168.1.50:3000'; // IP de la máquina host
    //baseUrl = 'http://10.0.2.2:3000'; Para emulador Android
  }
  // Core
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(baseUrl: baseUrl));

  // Data sources
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSource(getIt<ApiClient>()),
  );

  // Repositories
  getIt.registerLazySingleton<AuthRepositoryImpl>(
    () => AuthRepositoryImpl(getIt<AuthRemoteDataSource>()),
  );

  // Use cases
  getIt.registerLazySingleton<Login>(() => Login(getIt<AuthRepositoryImpl>()));
  getIt.registerLazySingleton<Logout>(
    () => Logout(getIt<AuthRepositoryImpl>()),
  );
  getIt.registerLazySingleton<LoginWithGoogle>(
    () => LoginWithGoogle(getIt<AuthRepositoryImpl>()),
  );
  getIt.registerLazySingleton<Register>(
    () => Register(getIt<AuthRepositoryImpl>()),
  );
  getIt.registerLazySingleton<RegisterWithGoogle>(
    () => RegisterWithGoogle(getIt<AuthRepositoryImpl>()),
  );

  // Bloc
  getIt.registerFactory<AuthBloc>(
    () => AuthBloc(
      loginUseCase: getIt<Login>(),
      logoutUseCase: getIt<Logout>(),
      loginWithGoogleUseCase: getIt<LoginWithGoogle>(),
      registerWithGoogleUseCase: getIt<RegisterWithGoogle>(),
      registerUseCase: getIt<Register>(),
    ),
  );

  // Servicios core
  getIt.registerLazySingleton<GoogleSignInService>(() => GoogleSignInService());
}
