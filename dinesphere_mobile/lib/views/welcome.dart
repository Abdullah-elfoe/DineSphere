import 'package:dinesphere/Widgets/tryAutoLogin.dart';
import 'package:flutter/material.dart';
import 'package:dinesphere/theme/AppColors.dart';
import 'package:dinesphere/views/auth.dart';

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.secondary,

      body: Stack(
        children: [
          // 1. Top Curved Background (Pinkish Shape)
          Positioned(
            top: -100,
            left: -50,
            child: Container(
              width: MediaQuery.of(context).size.width * 1.2,
              height: MediaQuery.of(context).size.height * 0.6,
              decoration: const BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.all(Radius.elliptical(300, 250)),
              ),
            ),
          ),

          // 2. Main Content
          SafeArea(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // --- SPACE FOR LOTTIE ---
                    SizedBox(
                      height: 200,
                      width: 200,
                      child: Placeholder(color: Colors.red.shade100),
                      // Use: Lottie.asset('assets/your_animation.json'),
                    ),
                    const SizedBox(height: 30),

                    // Title
                    const Text(
                      'DineSphere',
                      style: TextStyle(
                        fontSize: 42,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary, // Dark red
                        letterSpacing: 2,
                      ),
                    ),

                    // Tagline
                    const Text(
                      'DineSphere is a modern dining and restaurant discovery platform to \nmake eating out effortless, exiciting and memorable.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.text,
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 80),

                    // Reserve Button
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.ternary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: FilledButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) {
                                  return AuthScreen();
                                },
                              ),
                            );
                          },
                          child: Text(
                            'Login',
                            style: TextStyle(fontSize: 18, color: Colors.white),
                          ),
                        ),
                      ),
                    ),

                    // Divider
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 20.0),
                      child: Row(
                        children: [
                          Expanded(child: Divider(color: Colors.grey)),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10.0),
                            child: Text(
                              "Or",
                              style: TextStyle(color: Colors.grey),
                            ),
                          ),
                          Expanded(child: Divider(color: Colors.grey)),
                        ],
                      ),
                    ),

                    // Track Button (Flat/Text Button)
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Signup',
                        style: TextStyle(
                          fontSize: 18,
                          color: AppColors.ternary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
    ;
  }
}
