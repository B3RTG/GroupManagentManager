class User {
  final String id;
  final String name;
  final String username;
  final String email;
  final List<String> preferredSports;
  final String? avatarUrl;
  final String? phoneNumber;
  final bool isActive;
  final DateTime lastLogin;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.name,
    required this.username,
    required this.email,
    required this.preferredSports,
    this.avatarUrl,
    this.phoneNumber,
    required this.isActive,
    required this.lastLogin,
    required this.createdAt,
    required this.updatedAt,
  });
}
