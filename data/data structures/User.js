/* eslint-disable grouped-accessor-pairs */
// eslint-disable-next-line no-unused-vars
class User {
  constructor(
    id = null,
    username = '',
    email = '',
    password = '',
    registrationDate = new Date(),
    lastLoginDate = null,
    location = null,
    interests = null,
    sustainabilityScore = 0,
    profilePicure = null,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.registrationDate = registrationDate;
    this.lastLoginDate = lastLoginDate;
  }

  // Getters
  get Id() {
    return this.id;
  }

  get Username() {
    return this.username;
  }

  get Email() {
    return this.email;
  }

  get Password() {
    return this.password;
  }

  get RegistrationDate() {
    return this.registrationDate;
  }

  get LastLoginDate() {
    return this.lastLoginDate;
  }

  get Location() {
    return this.location;
  }

  get Interests() {
    return this.interests;
  }

  get SustainabilityScore() {
    return this.sustainabilityScore;
  }

  get ProfilePicure() {
    return this.profilePicure;
  }

  // Setters
  set Username(username) {
    this.username = username;
  }

  set Email(email) {
    this.email = email;
  }

  set Password(password) {
    this.password = password;
  }

  set RegistrationDate(registrationDate) {
    this.registrationDate = registrationDate;
  }

  set LastLoginDate(lastLoginDate) {
    this.lastLoginDate = lastLoginDate;
  }

  set Location(location) {
    this.location = location;
  }

  set Interests(interests) {
    this.interests = interests;
  }

  set SustainabilityScore(score) {
    this.sustainabilityScore = score;
  }

  set ProfilePicure(profilePicure) {
    this.profilePicure = profilePicure;
  }

  // Methods for user-related actions (e.g., hashing password)
}

module.exports = User;
