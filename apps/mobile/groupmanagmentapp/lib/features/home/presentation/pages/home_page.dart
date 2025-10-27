import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthBloc>().state;
    String userName = '';
    if (authState is AuthAuthenticated) {
      userName = authState.userName;
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: Text(
          userName.isNotEmpty
              ? '¡Bienvenido, $userName!'
              : '¡Bienvenido a la pantalla principal!',
          style: const TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
