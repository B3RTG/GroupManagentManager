part of 'auth_bloc.dart';

abstract class AuthEvent {}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;
  AuthLoginRequested({required this.email, required this.password});
}

class AuthLogoutRequested extends AuthEvent {}

class AuthGoogleLoginRequested extends AuthEvent {
  final String idToken;
  AuthGoogleLoginRequested({required this.idToken});
}

class AuthGoogleRegisterRequested extends AuthEvent {
  final String idToken;
  AuthGoogleRegisterRequested({required this.idToken});
}

class AuthSignupRequested extends AuthEvent {
  final String email;
  final String name;
  final String password;
  AuthSignupRequested({required this.email, required this.name, required this.password});
}
