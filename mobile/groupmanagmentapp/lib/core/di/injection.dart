import 'package:get_it/get_it.dart';
import '../network/api_client.dart';
import '../../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../../features/auth/domain/usecases/login.dart';
import '../../../features/auth/domain/usecases/logout.dart';
import '../../../features/auth/presentation/bloc/auth_bloc.dart';

final getIt = GetIt.instance;

Future<void> configureDependencies() async {
  // Core
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(baseUrl: 'http://localhost:3000'));

  // Data sources
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSource(getIt<ApiClient>()),
  );

  // Repositories
  getIt.registerLazySingleton<AuthRepositoryImpl>(
    () => AuthRepositoryImpl(getIt<AuthRemoteDataSource>()),
  );

  // Use cases
  getIt.registerLazySingleton<Login>(
    () => Login(getIt<AuthRepositoryImpl>()),
  );
  getIt.registerLazySingleton<Logout>(
    () => Logout(getIt<AuthRepositoryImpl>()),
  );

  // Bloc
  getIt.registerFactory<AuthBloc>(
    () => AuthBloc(
      loginUseCase: getIt<Login>(),
      logoutUseCase: getIt<Logout>(),
    ),
  );
}
