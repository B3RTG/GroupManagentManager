import 'package:flutter/material.dart';
import 'package:groupmanagmentapp/core/di/injection.dart';
import 'package:groupmanagmentapp/core/services/secure_storage_service.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:groupmanagmentapp/features/auth/presentation/bloc/auth_bloc.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({Key? key}) : super(key: key);

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  final SecureStorageService _secureStorageService = getIt<SecureStorageService>();
  final LocalAuthentication _localAuth = LocalAuthentication();

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _secureStorageService.readToken();
    if (token != null && token.isNotEmpty) {
      final didAuthenticate = await _localAuth.authenticate(
        localizedReason: 'Autenticación biométrica requerida para acceder',
        biometricOnly: true,
      );
      if (didAuthenticate) {
        // Dispara el evento en el Bloc
        if (mounted) {
          context.read<AuthBloc>().add(AuthTokenLoginRequested(token: token));
        }
        // La navegación se hará en el BlocListener
      } else {
        _navigateToLogin();
      }
    } else {
      _navigateToLogin();
    }
  }

  // void _navigateToHome() {
  //   Navigator.of(context).pushReplacementNamed('/home');
  // }

  void _navigateToLogin() {
    Navigator.of(context).pushReplacementNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthAuthenticated) {
          Navigator.of(context).pushReplacementNamed('/home');
        }
        if (state is AuthError) {
          // Si el token no es válido, navega a login
          _navigateToLogin();
        }
      },
      child: const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      ),
    );
  }
}
