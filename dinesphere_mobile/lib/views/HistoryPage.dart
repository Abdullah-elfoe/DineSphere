import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:dinesphere/data/network.dart';
import 'package:dinesphere/data/auth_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  late Future<List<dynamic>> bookingsFuture;

  @override
  void initState() {
    super.initState();
    bookingsFuture = fetchBookings();
  }

  Future<List<dynamic>> fetchBookings() async {
    final token = await AuthStorage.getToken();
    if (token == null) throw Exception("User not authenticated");

    final response = await http.get(
      Uri.parse("http://$deviceIP:$port/api/bookings/"),
      headers: {"Authorization": "Token $token"},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to load booking history");
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFFBFBFB),
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          title: const Text(
            "Bookings",
            style: TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.w900,
              fontSize: 24,
            ),
          ),
          bottom: const TabBar(
            indicatorColor: Colors.redAccent,
            indicatorWeight: 3,
            labelColor: Colors.black,
            unselectedLabelColor: Colors.grey,
            labelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            tabs: [
              Tab(text: "Finished"),
              Tab(text: "Pending"),
              Tab(text: "Cancelled"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildTabContent("finished"), // All data moved here as requested
            _buildEmptyState("No pending bookings"),
            _buildEmptyState("No cancelled bookings"),
          ],
        ),
      ),
    );
  }

  Widget _buildTabContent(String status) {
    return FutureBuilder<List<dynamic>>(
      future: bookingsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(color: Colors.redAccent),
          );
        }
        if (snapshot.hasError) {
          print(snapshot.error);
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Text(
                "Either Server is down, \nor API is wrong or \nAuthorization token is missing!",
                style: TextStyle(color: Colors.red),
              ),
            ),
          );
        }

        final bookings = snapshot.data ?? [];
        if (bookings.isEmpty) return _buildEmptyState("No records found");

        return ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: bookings.length,
          itemBuilder: (context, index) =>
              _buildModernInfoCard(bookings[index]),
        );
      },
    );
  }

  Widget _buildModernInfoCard(dynamic booking) {
    final restaurant = booking['restaurant'] ?? {};
    final seats = booking['booking_no_of_seats'] ?? 0;
    final start = DateTime.parse(booking['booking_start_dateTime']).toLocal();
    final end = DateTime.parse(booking['booking_end_dateTime']).toLocal();

    final dateStr = DateFormat('EEEE, MMM dd').format(start);
    final timeRange =
        "${DateFormat('hh:mm a').format(start)} - ${DateFormat('hh:mm a').format(end)}";

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            // Left Accent Strip
            Container(
              width: 6,
              decoration: const BoxDecoration(
                color: Colors.redAccent,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          restaurant['name']?.toUpperCase() ?? 'RESTAURANT',
                          style: const TextStyle(
                            letterSpacing: 1.2,
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: Colors.redAccent,
                          ),
                        ),
                        Text(
                          "PKR ${booking['total_price'] ?? '0'}",
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      restaurant['title'] ?? "Table Reservation",
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 15),
                      child: Divider(
                        height: 1,
                        thickness: 1,
                        color: Color(0xFFF1F1),
                      ),
                    ),
                    _buildInfoRow(
                      Icons.calendar_month_outlined,
                      "Date",
                      dateStr,
                    ),
                    const SizedBox(height: 10),
                    _buildInfoRow(Icons.access_time_rounded, "Time", timeRange),
                    const SizedBox(height: 10),
                    _buildInfoRow(
                      Icons.chair_alt_rounded,
                      "Seats",
                      "$seats People",
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey[400]),
        const SizedBox(width: 10),
        Text(
          "$title: ",
          style: TextStyle(
            color: Colors.grey[500],
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String message) {
    return Center(
      child: Text(
        message,
        style: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.w600),
      ),
    );
  }
}
