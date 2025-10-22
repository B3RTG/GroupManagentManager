import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/auth_bloc.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({Key? key}) : super(key: key);

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  void _onLoginPressed() {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      context.read<AuthBloc>().add(
        AuthLoginRequested(email: _email, password: _password),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
        if (state is AuthAuthenticated) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Bienvenido, \\${state.userName}!')),
          );
          // Navegar a HomePage y reemplazar la ruta actual
          Future.microtask(() {
            Navigator.of(context).pushReplacementNamed('/home');
          });
        }
      },
      builder: (context, state) {
        return Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (value) => value != null && value.contains('@') ? null : 'Introduce un email válido',
                onSaved: (value) => _email = value ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Contraseña'),
                obscureText: true,
                validator: (value) => value != null && value.length >= 6 ? null : 'Mínimo 6 caracteres',
                onSaved: (value) => _password = value ?? '',
              ),
              const SizedBox(height: 16),
              state is AuthLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _onLoginPressed,
                      child: const Text('Iniciar sesión'),
                    ),
            ],
          ),
        );
      },
    );
  }
}
