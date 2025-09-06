// Mock user database - In a real app, this would be a backend API
const mockUsers = [
  { id: 1, name: "Alex", age: 25, gender: "Male", isOnline: true, preferences: { ageRange: [20, 30], gender: "Female" } },
  { id: 2, name: "Sarah", age: 23, gender: "Female", isOnline: true, preferences: { ageRange: [22, 28], gender: "Male" } },
  { id: 3, name: "Mike", age: 27, gender: "Male", isOnline: true, preferences: { ageRange: [20, 35], gender: "Female" } },
  { id: 4, name: "Emma", age: 24, gender: "Female", isOnline: true, preferences: { ageRange: [25, 30], gender: "Male" } },
  { id: 5, name: "David", age: 26, gender: "Male", isOnline: false, preferences: { ageRange: [22, 28], gender: "Female" } },
  { id: 6, name: "Lisa", age: 22, gender: "Female", isOnline: true, preferences: { ageRange: [20, 25], gender: "Male" } },
  { id: 7, name: "John", age: 29, gender: "Male", isOnline: true, preferences: { ageRange: [25, 35], gender: "Female" } },
  { id: 8, name: "Anna", age: 21, gender: "Female", isOnline: true, preferences: { ageRange: [20, 26], gender: "Male" } },
];

class MatchmakingService {
  constructor() {
    this.currentUser = null;
    this.userCoins = 0;
    this.userBoost = false;
  }

  // Set current user data
  setCurrentUser(userData) {
    this.currentUser = userData;
    this.userCoins = parseInt(localStorage.getItem('userCoins') || '0');
    this.userBoost = localStorage.getItem('userBoost') === 'true';
  }

  // Get user's coins and boost status
  getUserStatus() {
    return {
      coins: this.userCoins,
      hasBoost: this.userBoost,
      canFilter: this.userCoins >= 10 || this.userBoost
    };
  }

  // Find a random match
  findRandomMatch(preferences = null) {
    const onlineUsers = mockUsers.filter(user => 
      user.isOnline && 
      user.id !== this.currentUser?.id
    );

    if (onlineUsers.length === 0) {
      return { success: false, message: "No users online at the moment" };
    }

    let potentialMatches = onlineUsers;

    // Apply filtering if user has coins/boost
    if (preferences && (this.userCoins >= 10 || this.userBoost)) {
      potentialMatches = this.applyFilters(onlineUsers, preferences);
      
      // Deduct coins if filtering was used
      if (this.userCoins >= 10 && !this.userBoost) {
        this.userCoins -= 10;
        localStorage.setItem('userCoins', this.userCoins.toString());
      }
    }

    if (potentialMatches.length === 0) {
      return { 
        success: false, 
        message: "No matches found with your preferences. Try adjusting your filters or use random matching." 
      };
    }

    // Select random match
    const randomIndex = Math.floor(Math.random() * potentialMatches.length);
    const match = potentialMatches[randomIndex];

    return {
      success: true,
      match: {
        id: match.id,
        name: match.name,
        age: match.age,
        gender: match.gender,
        preferences: match.preferences
      }
    };
  }

  // Apply user preferences to filter matches
  applyFilters(users, preferences) {
    return users.filter(user => {
      // Age filter
      if (preferences.ageRange) {
        const [minAge, maxAge] = preferences.ageRange;
        if (user.age < minAge || user.age > maxAge) {
          return false;
        }
      }

      // Gender filter
      if (preferences.gender && preferences.gender !== 'Any') {
        if (user.gender !== preferences.gender) {
          return false;
        }
      }

      // Check if user's preferences match current user
      if (user.preferences) {
        const userAge = this.currentUser?.age || 25;
        const userGender = this.currentUser?.gender || 'Male';
        
        // Check age compatibility
        if (user.preferences.ageRange) {
          const [minAge, maxAge] = user.preferences.ageRange;
          if (userAge < minAge || userAge > maxAge) {
            return false;
          }
        }

        // Check gender compatibility
        if (user.preferences.gender && user.preferences.gender !== 'Any') {
          if (userGender !== user.preferences.gender) {
            return false;
          }
        }
      }

      return true;
    });
  }

  // Add coins to user account
  addCoins(amount) {
    this.userCoins += amount;
    localStorage.setItem('userCoins', this.userCoins.toString());
  }

  // Purchase boost
  purchaseBoost() {
    if (this.userCoins >= 50) {
      this.userCoins -= 50;
      this.userBoost = true;
      localStorage.setItem('userCoins', this.userCoins.toString());
      localStorage.setItem('userBoost', 'true');
      return true;
    }
    return false;
  }

  // Simulate finding a match (with loading time)
  async findMatch(preferences = null) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return this.findRandomMatch(preferences);
  }
}

export default new MatchmakingService();
