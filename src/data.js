// ============================================
// ANDMESALV
// Kõik andmed hoitakse mälus
// Rakenduse taaskäivitamisel andmed kaovad
// ============================================

const data = {
  users: [
    { id: 1, username: "mari", password: "1234", name: "Mari Maasikas" },
    { id: 2, username: "jaan", password: "1234", name: "Jaan Jansen" },
  ],

  menu: [
    { id: 1, name: "Margherita pizza", category: "pizza", price: 8.99, description: "Tomatikaste, mozzarella, basiilik" },
    { id: 2, name: "Pepperoni pizza", category: "pizza", price: 10.99, description: "Tomatikaste, mozzarella, pepperoni" },
    { id: 3, name: "Caesar salat", category: "salat", price: 6.99, description: "Rooma salat, kreekerid, parmesan" },
    { id: 4, name: "Kanassupp", category: "supp", price: 5.99, description: "Kana, köögiviljad, nuudlid" },
    { id: 5, name: "Šokolaadikook", category: "dessert", price: 4.99, description: "Tumeda šokolaadiga kook" },
    { id: 6, name: "Limonaad", category: "jook", price: 2.99, description: "Värskelt pressitud sidrunilimonaad" },
  ],

  orders: [],
  sessions: {},

  nextUserId: 3,
  nextOrderId: 1,
};

module.exports = data;
