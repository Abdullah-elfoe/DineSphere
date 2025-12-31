import 'package:dinesphere/views/welcome.dart';
import 'package:flutter/material.dart';
import 'package:dinesphere/views/mainScreen.dart';
import 'package:dinesphere/views/auth.dart';
import 'package:dinesphere/data/auth_storage.dart';

class TryAutoLogin extends StatelessWidget {
  const TryAutoLogin({super.key});

  Future<bool> _isLoggedIn() async {
    final token = await AuthStorage.getToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _isLoggedIn(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (snapshot.data == true) {
          return MainScreen();   // ✅ auto-login
        } else {
          return const WelcomePage(); // ❌ not logged in
        }
      },
    );
  }
}
