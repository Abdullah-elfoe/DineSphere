import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                'My App',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

          _drawerItem(
            context,
            icon: Icons.account_box_outlined,
            title: 'About',
            onTap: () {
              // Navigator.pop(context);
            },
          ),

          _drawerItem(
            context,
            icon: Icons.mail_outline,
            title: 'Contact',
            onTap: () {
              Navigator.pop(context);
            },
          ),

          _drawerItem(
            context,
            icon: Icons.local_shipping,
            title: 'Track',
            onTap: () {
              Navigator.pop(context);
            },
          ),

          const Divider(),

          _drawerItem(
            context,
            icon: Icons.settings,
            title: 'Settings',
            onTap: () {
              Navigator.pop(context);
            },
          ),

          _drawerItem(
            context,
            icon: Icons.logout,
            title: 'Logout',
            onTap: () {
              Navigator.pop(context);
              // TODO: handle logout
            },
          ),
        ],
      ),
    );
  }

  Widget _drawerItem(
      BuildContext context, {
        required IconData icon,
        required String title,
        required VoidCallback onTap,
      }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: onTap,
    );
  }
}
