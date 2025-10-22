import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/login.dart';
import 'package:groupmanagmentapp/features/auth/domain/usecases/logout.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final Login loginUseCase;
  final Logout logoutUseCase;

  AuthBloc({required this.loginUseCase, required this.logoutUseCase}) : super(AuthInitial()) {
    on<AuthLoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await loginUseCase(email: event.email, password: event.password);
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
  }
}
