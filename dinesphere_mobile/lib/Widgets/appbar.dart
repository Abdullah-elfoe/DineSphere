import 'package:dinesphere/theme/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:dinesphere/data/constants.dart';


class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title = appName;

  CustomAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(Icons.widgets),
          onPressed: () {
            Scaffold.of(context).openDrawer();
          },
        ),
      ),
      title: Text(title),
      actions: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: CircleAvatar(
            backgroundColor: AppColors.transparent,
            child: Icon(
              Icons.person,
              size: 24,
              color: AppColors.primary,
            ),
          ),
        )
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
