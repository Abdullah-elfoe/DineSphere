import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:dinesphere/data/network.dart';
import 'package:dinesphere/views/productDisplay.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> allRestaurants = [];
  List<dynamic> displayedResults = [];
  List<dynamic> dynamicSeatingTypes = []; // Dynamic seating types from API
  bool isLoading = true;

  // Filter States
  String selectedSeating = 'All';
  RangeValues priceRange = const RangeValues(100, 5000);
  String sortBy = 'Highest Rated';

  @override
  void initState() {
    super.initState();
    fetchInitialData();
  }

  Future<void> fetchInitialData() async {
    setState(() => isLoading = true);
    try {
      // Fetching both Restaurants and Seating Types
      final responses = await Future.wait([
        http.get(Uri.parse("http://$deviceIP:$port/api/restaurants/")),
        http.get(Uri.parse("http://$deviceIP:$port/api/seating-types/")),
      ]);

      if (responses[0].statusCode == 200 && responses[1].statusCode == 200) {
        setState(() {
          allRestaurants = jsonDecode(responses[0].body);
          dynamicSeatingTypes = jsonDecode(responses[1].body);
          displayedResults = allRestaurants;
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Initialization error: $e");
      setState(() => isLoading = false);
    }
  }

  // --- Search Logic ---
  void _performSearch() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      displayedResults = allRestaurants.where((r) {
        final nameMatch = r['name'].toString().toLowerCase().contains(query);
        return nameMatch;
      }).toList();
    });
  }

  // --- Reset Filters ---
  void _resetFilters() {
    setState(() {
      selectedSeating = 'All';
      priceRange = const RangeValues(100, 5000);
      sortBy = 'Highest Rated';
      displayedResults = allRestaurants;
    });
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Container(width: 40, height: 4, color: Colors.grey[300])),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Filter Results", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                      TextButton(
                        onPressed: () {
                          _resetFilters();
                          Navigator.pop(context);
                        },
                        child: const Text("Reset All", style: TextStyle(color: Colors.redAccent)),
                      )
                    ],
                  ),
                  const SizedBox(height: 25),

                  // 1. DYNAMIC Seating Type
                  const Text("Seating Type", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: [
                      'All',
                      ...dynamicSeatingTypes.map((s) => s['name'].toString())
                    ].map((type) {
                      final isSelected = selectedSeating == type;
                      return ChoiceChip(
                        label: Text(type),
                        selected: isSelected,
                        onSelected: (val) => setSheetState(() => selectedSeating = type),
                        selectedColor: Colors.black,
                        labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 25),

                  // 2. Price Range in PKR
                  Text("Price Range (PKR ${priceRange.start.round()} - PKR ${priceRange.end.round()})",
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  RangeSlider(
                    values: priceRange,
                    min: 0,
                    max: 10000,
                    activeColor: Colors.black,
                    onChanged: (val) => setSheetState(() => priceRange = val),
                  ),

                  const SizedBox(height: 25),

                  // 3. Sort By Reviews
                  const Text("Sort By Reviews", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  DropdownButton<String>(
                    isExpanded: true,
                    value: sortBy,
                    items: ['Highest Rated', 'Most Reviews'].map((String value) {
                      return DropdownMenuItem<String>(value: value, child: Text(value));
                    }).toList(),
                    onChanged: (val) => setSheetState(() => sortBy = val!),
                  ),

                  const SizedBox(height: 30),
                  SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                      onPressed: () {
                        // Logic to apply local filters
                        setState(() {
                          displayedResults = allRestaurants.where((r) {
                            // Filter logic here (example: by seating name)
                            bool seatingMatch = selectedSeating == 'All' ||
                                (r['seating_types'] as List).any((s) => s['name'] == selectedSeating);
                            return seatingMatch;
                          }).toList();
                        });
                        Navigator.pop(context);
                      },
                      child: const Text("Apply Filters", style: TextStyle(color: Colors.white, fontSize: 16)),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // SEARCH BAR SECTION WITH SEARCH BUTTON
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onSubmitted: (val) => _performSearch(), // Trigger on keyboard 'Enter'
                        decoration: InputDecoration(
                          hintText: "Search restaurants...",
                          prefixIcon: const Icon(Icons.search, color: Colors.grey),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.arrow_forward, color: Colors.black),
                            onPressed: _performSearch, // The Search Button
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 15),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 15),
                  GestureDetector(
                    onTap: _showFilterSheet,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.tune, color: Colors.white),
                    ),
                  )
                ],
              ),
            ),

            // RESULTS GRID
            Expanded(
              child: isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: displayedResults.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 15,
                  mainAxisSpacing: 15,
                  childAspectRatio: 0.75,
                ),
                itemBuilder: (context, index) {
                  final restaurant = displayedResults[index];
                  return _buildConsistentCard(restaurant);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConsistentCard(dynamic restaurant) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(
        builder: (context) => RestaurantDetailPage(restaurantId: restaurant['id']),
      )),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                image: DecorationImage(
                  image: NetworkImage(restaurant['image']),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            restaurant['name'] ?? 'Restaurant',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          Text(
            "PKR ${restaurant['price_per_seat'] ?? '0'} / seat",
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
        ],
      ),
    );
  }
}