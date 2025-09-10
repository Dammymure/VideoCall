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

  // Find a match with deterministic shared room naming
  findRandomMatch(preferences = null) {
    const currentUserId = this.currentUser?.id;
    const allOnline = mockUsers.filter(u => u.isOnline);

    // If fewer than 2 online, no match possible
    if (allOnline.length < 2) {
      return { success: false, message: "No users online at the moment" };
    }

    // Build candidate list excluding self when we know self id
    let onlineUsers = allOnline;
    if (currentUserId != null) {
      onlineUsers = allOnline.filter(user => user.id !== currentUserId);
    }

    let potentialMatches = onlineUsers;

    // If there are only 2 users online total, always pair them; ignore filters
    if (allOnline.length === 2 && currentUserId != null) {
      potentialMatches = onlineUsers;
    } else if (preferences && (this.userCoins >= 10 || this.userBoost)) {
      // Otherwise apply filtering if user has coins/boost
      potentialMatches = this.applyFilters(onlineUsers, preferences);
      // Deduct coins if filtering was used (and not boosted)
      if (this.userCoins >= 10 && !this.userBoost) {
        this.userCoins -= 10;
        localStorage.setItem('userCoins', this.userCoins.toString());
      }
    }

    if (potentialMatches.length === 0) {
      // Fall back: if no filtered results, use the first available online
      potentialMatches = onlineUsers;
    }

    // Deterministic pick: smallest id among candidates
    const match = potentialMatches.slice().sort((a, b) => a.id - b.id)[0];

    // Global shared room so any two live users connect without backend
    const room = 'call_room_global';

    return {
      success: true,
      match: {
        id: match.id,
        name: match.name,
        age: match.age,
        gender: match.gender,
        preferences: match.preferences,
        room
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
