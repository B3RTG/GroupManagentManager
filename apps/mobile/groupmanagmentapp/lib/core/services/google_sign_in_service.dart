import 'package:google_sign_in/google_sign_in.dart';
import 'dart:async';

class GoogleSignInService {
  static final GoogleSignInService _instance = GoogleSignInService._internal();
  factory GoogleSignInService() => _instance;
  GoogleSignInService._internal();

  bool _initialized = false;
  StreamSubscription? _googleSignInSub;

  Future<void> initialize({
    required String clientId,
    required String serverClientId,
    required void Function(GoogleSignInAuthenticationEventSignIn event) onSignIn,
    required void Function(Object error) onError,
  }) async {
    if (_initialized) return;
    await GoogleSignIn.instance.initialize(
      clientId: clientId,
      serverClientId: serverClientId,
    );
    _googleSignInSub = GoogleSignIn.instance.authenticationEvents.listen(
      (event) {
        if (event is GoogleSignInAuthenticationEventSignIn) {
          onSignIn(event);
        }
      },
      onError: onError,
    );
    _initialized = true;
  }

  Future<void> authenticate() async {
    await GoogleSignIn.instance.authenticate();
  }

  void dispose() {
    _googleSignInSub?.cancel();
    _initialized = false;
  }
}
