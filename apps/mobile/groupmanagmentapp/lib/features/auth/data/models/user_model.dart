class UserModel {
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

  UserModel({
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

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      username: json['username'] as String,
      email: json['email'] as String,
      preferredSports: List<String>.from(json['preferredSports'] ?? []),
      avatarUrl: json['avatarUrl'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      isActive: json['isActive'] as bool,
      lastLogin:
          json['lastLogin'] != null && (json['lastLogin'] as String).isNotEmpty
          ? DateTime.parse(json['lastLogin'] as String)
          : DateTime.fromMillisecondsSinceEpoch(0), // o null si lo prefieres
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}

class AuthResponseModel {
  final UserModel user;
  final String token;

  AuthResponseModel({required this.user, required this.token});

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseModel(
      user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
      token: json['token'] as String,
    );
  }
}
