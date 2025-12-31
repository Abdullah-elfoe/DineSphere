import 'dart:convert';
import 'package:dinesphere/data/network.dart';
import 'package:dinesphere/views/productDisplay.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const String baseUrl = "http://$deviceIP:$port";

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<dynamic> restaurants = [];
  List<dynamic> filteredRestaurants = [];
  List<dynamic> seatingTypes = [];
  bool isLoading = true;
  String selectedSeating = 'All';

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    await Future.wait([fetchRestaurants(), fetchSeatingTypes()]);
    setState(() {
      isLoading = false;
      filteredRestaurants = List.from(restaurants); // default show all
    });
  }

  Future<void> fetchRestaurants() async {
    try {
      final uri = Uri.parse("$baseUrl/api/restaurants/");
      final res = await http.get(uri);

      if (res.statusCode == 200) {
        restaurants = jsonDecode(res.body);
      } else {
        debugPrint("Error fetching restaurants: ${res.statusCode}");
      }
    } catch (e) {
      debugPrint("Exception fetching restaurants: $e");
    }
  }

  Future<void> fetchSeatingTypes() async {
    try {
      final uri = Uri.parse("$baseUrl/api/seating-types/");
      final res = await http.get(uri);

      if (res.statusCode == 200) {
        seatingTypes = jsonDecode(res.body);
      } else {
        debugPrint("Error fetching seating types: ${res.statusCode}");
      }
    } catch (e) {
      debugPrint("Exception fetching seating types: $e");
    }
  }

  void filterRestaurants(String seatingName) {
    setState(() {
      selectedSeating = seatingName;
      if (seatingName == 'All') {
        filteredRestaurants = List.from(restaurants);
      } else {
        filteredRestaurants = restaurants.where((r) {
          final seatingList = r['seating_types'] as List<dynamic>? ?? [];
          return seatingList.any((s) => s['name'] == seatingName);
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Header Section
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Find, Eat",
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
                RichText(
                  text: const TextSpan(
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                    children: [
                      TextSpan(
                        text: "Repeat!",
                        style: TextStyle(
                          decoration: TextDecoration.underline,
                          decorationColor: Colors.orange,
                          decorationThickness: 2,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 25),

          // 2. Seating Type Chips
          SizedBox(
            height: 45,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                _buildCategoryChip('All', isSelected: selectedSeating == 'All'),
                ...seatingTypes.map((s) {
                  return _buildCategoryChip(
                    s['name'],
                    isSelected: selectedSeating == s['name'],
                  );
                }).toList(),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 3. Dynamic Grid Section OR Empty State
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: filteredRestaurants.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 60),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.sentiment_very_dissatisfied, size: 41),
                          SizedBox(height: 20),
                          Text(
                            "Oops, no restaurants found!",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredRestaurants.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 15,
                          mainAxisSpacing: 15,
                          childAspectRatio: 0.7,
                        ),
                    itemBuilder: (context, index) {
                      final restaurant = filteredRestaurants[index];
                      return _buildProductCard(
                        Id: restaurant['id']??1,
                        name: restaurant['name'] ?? 'Unknown',
                        imageUrl:
                            restaurant['image'] ??
                            'https://via.placeholder.com/300',
                        openingHour: restaurant['default_opening_hour'] ?? 0,
                        closingHour: restaurant['default_closing_hour'] ?? 0,
                        hasTopOffers: restaurant['has_top_offers'] ?? false,
                      );
                    },
                  ),
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  // --- UI COMPONENTS ---
  Widget _buildCategoryChip(String label, {bool isSelected = false}) {
    return GestureDetector(
      onTap: () => filterRestaurants(label),
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected ? Colors.black : Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.black54,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildProductCard({
    required int Id,
    required String name,
    required String imageUrl,
    required int openingHour,
    required int closingHour,
    required bool hasTopOffers,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                RestaurantDetailPage(restaurantId: Id),
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: NetworkImage(imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                if (hasTopOffers)
                  const Positioned(
                    top: 10,
                    left: 10,
                    child: CircleAvatar(
                      backgroundColor: Colors.orange,
                      radius: 14,
                      child: Icon(
                        Icons.local_offer,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                const Positioned(
                  top: 10,
                  right: 10,
                  child: CircleAvatar(
                    backgroundColor: Colors.white,
                    radius: 14,
                    child: Icon(
                      Icons.favorite_border,
                      size: 16,
                      color: Colors.black,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          Text(
            "Hours: $openingHour - $closingHour",
            style: const TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
