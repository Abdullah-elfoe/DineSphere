import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:dinesphere/data/network.dart';
import 'package:dinesphere/data/auth_storage.dart';

class RestaurantDetailPage extends StatefulWidget {
  final int restaurantId;

  const RestaurantDetailPage({super.key, required this.restaurantId});

  @override
  State<RestaurantDetailPage> createState() => _RestaurantDetailPageState();
}

class _RestaurantDetailPageState extends State<RestaurantDetailPage> {
  Map<String, dynamic>? restaurantData;
  List<dynamic> testimonials = [];
  bool isLoading = true;
  bool isFavorite = false;

  String? selectedSeating;
  DateTime selectedDate = DateTime.now();
  TimeOfDay startTime = const TimeOfDay(hour: 18, minute: 0);
  TimeOfDay endTime = const TimeOfDay(hour: 19, minute: 0);

  @override
  void initState() {
    super.initState();
    fetchRestaurantDetails();
  }

  Future<void> fetchRestaurantDetails() async {
    final token = await AuthStorage.getToken();
    if (token == null) throw Exception("User not authenticated");

    try {
      final res = await http.get(
        Uri.parse(
          "http://$deviceIP:$port/api/restaurants/${widget.restaurantId}/",
        ),
        headers: {"Authorization": "Token $token"},
      );
      final testRes = await http.get(
        Uri.parse(
          "http://$deviceIP:$port/api/testimonials/?search=${widget.restaurantId}",
        ),
          headers: {"Authorization": "Token $token"},
      );

      if (res.statusCode == 200) {
        setState(() {
          restaurantData = jsonDecode(res.body);
          testimonials = jsonDecode(testRes.body);
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading)
      return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // 1. Full-width Background Image
          _buildHeroImage(),

          // 2. Scrollable Content overlapping the image
          SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 300), // Height of the visible image part
                // 3. BOTTOM SECTION (The Rounded Card)
                Container(
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(40),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 10,
                        offset: Offset(0, -5),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(28.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Drag indicator for modern feel
                        Center(
                          child: Container(
                            width: 40,
                            height: 5,
                            margin: const EdgeInsets.only(bottom: 20),
                            decoration: BoxDecoration(
                              color: Colors.grey[300],
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),

                        Text(
                          restaurantData?['name'] ?? "Restaurant Name",
                          style: const TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -1,
                          ),
                        ),
                        Text(
                          restaurantData?['title'] ?? "Subtitle",
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey.shade500,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 30),

                        // SEATING
                        _sectionTitle("Seating Type"),
                        const SizedBox(height: 12),
                        _buildSeatingChips(),
                        const SizedBox(height: 30),

                        // SCHEDULE
                        _sectionTitle("Reservation Schedule"),
                        const SizedBox(height: 16),
                        _buildDateTimePicker(),
                        const SizedBox(height: 35),

                        // TESTIMONIALS
                        _sectionTitle("Guest Experiences"),
                        const SizedBox(height: 20),
                        _buildCleanTestimonialList(),
                        const SizedBox(height: 40),

                        // BUTTON
                        _buildSubmitButton(),
                        const SizedBox(height: 50),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 4. Floating Header Buttons (Static)
          _buildFloatingHeader(),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 18,
        color: Color(0xFF1A1A1A),
      ),
    );
  }

  Widget _buildHeroImage() {
    final rawUrl = restaurantData?['image'] ?? "";
    final imageUrl = rawUrl.isEmpty
        ? "https://via.placeholder.com/600"
        : "http://$deviceIP:$port$rawUrl";
    return SizedBox(
      height: 350,
      width: double.infinity,
      child: Image.network(imageUrl, fit: BoxFit.cover),
    );
  }

  Widget _buildFloatingHeader() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _headerButton(
              Icons.arrow_back_ios_new,
              () => Navigator.pop(context),
            ),
            _headerButton(
              isFavorite ? Icons.favorite : Icons.favorite_border,
              () => setState(() => isFavorite = !isFavorite),
              color: isFavorite ? Colors.red : Colors.black,
            ),
          ],
        ),
      ),
    );
  }

  Widget _headerButton(
    IconData icon,
    VoidCallback onTap, {
    Color color = Colors.black,
  }) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
      ),
      child: IconButton(
        icon: Icon(icon, size: 20, color: color),
        onPressed: onTap,
      ),
    );
  }

  Widget _buildCleanTestimonialList() {
    if (testimonials.isEmpty) return const Text("No reviews yet.");
    return Column(
      children: testimonials
          .map(
            (t) => Padding(
              padding: const EdgeInsets.only(bottom: 25.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(
                    radius: 20,
                    backgroundColor: Color(0xFFFFEBEE),
                    child: Icon(Icons.person_rounded, color: Colors.redAccent),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          t['creator_name'] ?? "Guest",
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          t['text'] ?? "",
                          style: TextStyle(
                            color: Colors.grey[600],
                            height: 1.4,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildDateTimePicker() {
    return Column(
      children: [
        _buildPickerTile(
          Icons.calendar_today_rounded,
          "Reservation Date",
          DateFormat('EEEE, d MMMM').format(selectedDate),
          () async {
            final date = await showDatePicker(
              context: context,
              initialDate: selectedDate,
              firstDate: DateTime.now(),
              lastDate: DateTime.now().add(const Duration(days: 60)),
            );
            if (date != null) setState(() => selectedDate = date);
          },
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildPickerTile(
                Icons.more_time_rounded,
                "Arrival",
                startTime.format(context),
                () async {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: startTime,
                  );
                  if (time != null) setState(() => startTime = time);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildPickerTile(
                Icons.history_rounded,
                "Departure",
                endTime.format(context),
                () async {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: endTime,
                  );
                  if (time != null) setState(() => endTime = time);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPickerTile(
    IconData icon,
    String label,
    String value,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.grey[100]!),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: Colors.redAccent),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey[500],
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSeatingChips() {
    final types = restaurantData?['seating_types'] as List? ?? [];
    return Wrap(
      spacing: 10,
      children: types.map((s) {
        final isSelected = selectedSeating == s['name'];
        return FilterChip(
          label: Text(s['name']),
          selected: isSelected,
          onSelected: (val) =>
              setState(() => selectedSeating = val ? s['name'] : null),
          selectedColor: Colors.redAccent,
          checkmarkColor: Colors.white,
          labelStyle: TextStyle(
            color: isSelected ? Colors.white : Colors.black87,
            fontWeight: FontWeight.w600,
          ),
          backgroundColor: Colors.grey[100],
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: BorderSide.none,
        );
      }).toList(),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.redAccent.withOpacity(0.3),
            blurRadius: 15,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.redAccent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
          ),
          elevation: 0,
        ),
        onPressed: () {},
        child: const Text(
          "Book a Table",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
