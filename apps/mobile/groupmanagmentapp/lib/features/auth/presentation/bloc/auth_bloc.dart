import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/login.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/login_google.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/logout.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/register_google.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/register.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final Login loginUseCase;
  final Logout logoutUseCase;
  final LoginWithGoogle loginWithGoogleUseCase;
  final RegisterWithGoogle registerWithGoogleUseCase;
  final Register registerUseCase;

  AuthBloc({
    required this.loginUseCase,
    required this.logoutUseCase,
    required this.loginWithGoogleUseCase,
    required this.registerWithGoogleUseCase,
    required this.registerUseCase,
  }) : super(AuthInitial()) {
    on<AuthLoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await loginUseCase(
          email: event.email,
          password: event.password,
        );
        emit(AuthAuthenticated(user.name));
      } catch (e) {
        emit(AuthError(e.toString()));
      }
    });

    on<AuthLogoutRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        await logoutUseCase();
        emit(AuthInitial());
      } catch (e) {
        emit(AuthError(e.toString()));
      }
    });

    on<AuthGoogleLoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        // Aquí llama a tu repositorio/servicio para enviar el idToken al backend
        final user = await loginWithGoogleUseCase(idToken: event.idToken);
        emit(AuthAuthenticated(user.name));
      } catch (e) {
        emit(AuthError('Error al iniciar sesión con Google'));
      }
    });

    on<AuthGoogleRegisterRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        // Aquí llama a tu repositorio/servicio para registrar con el idToken al backend
        final user = await registerWithGoogleUseCase(idToken: event.idToken);
        emit(AuthAuthenticated(user.name));
      } catch (e) {
        emit(AuthError('Error al registrar con Google'));
      }
    });

    on<AuthSignupRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await registerUseCase(
          email: event.email,
          name: event.name,
          password: event.password,
        );
        emit(AuthAuthenticated(user.name));
      } catch (e) {
        emit(AuthError('Error al registrar usuario'));
      }
    });
  }
}
