import 'package:dinesphere/Widgets/tryAutoLogin.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


Future<List<dynamic>> fetchReservations() async {
  final response = await http.get(
      Uri.parse('http://192.168.0.111:8000/ApplicationProgrammingInterface/get/Restaurants')
  );

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to load reservations');
  }
}


void main() {
  runApp(MyApp());
}



class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DineSphere',
      home: const TryAutoLogin(),
    );
  }

}
