/**
 * Hearthstone Cards 
 * By Denis Dervisevic
 * Simple application utalizing hearthstoneAPI to show cards on the watch.
 */
var UI = require('ui');
var ajax = require('ajax');

// First show a Loading card as lookup can take a couple of seconds.
var main = new UI.Card({
  title: 'HS Cards',
  subtitle: '',
  body: 'Loading...'
});

main.show();

// Define a bunch of functions for translating the ID's to readable information.
function getQuality(id) {
  switch(id) {
    case 0: return "Free";
    case 1: return "Common";
    case 3: return "Rare";
    case 4: return "Epic";
    case 5: return "Legendary";
  }
}

function getType(id) {
  switch(id) {
    case 4: return "Minion";
    case 5: return "Spell";
    case 7: return "Weapon";
  }
}

function getRace(id) {
  switch(id) {
    case 14: return "Murloc";
    case 15: return "Demon";
    case 20: return "Beast";
    case 21: return "Totem";
    case 23: return "Pirate";
    case 24: return "Dragon";
    default: return "Neutral";
  }
}

function getClass(id) {
  switch(id) {
    case 1: return "Warrior";
    case 2: return "Paladin";
    case 3: return "Hunter";
    case 4: return "Rogue";
    case 5: return "Priest";
    case 7: return "Shaman";
    case 8: return "Mage";
    case 9: return "Warlock";
    case 11: return "Druid";
    default: return "";
  }
}

// Used in 2 places, builds a string with mana cost and attack/health.
function getCostString(card) {
  var desc = getQuality(card.quality) + " " + card.cost + " mana ";
  if (card.type == 4) desc += card.attack + "/" + card.health;
  else if(card.type == 7) desc += card.attack + "/" + card.durability; 
  else desc += "spell";
  return desc;
}

// Send the AJAX request to the API for the cards
ajax({
  url: 'http://hearthstoneapi.com/cards/findAll',
  type: 'json'
},
function(cards) {
  var items = [];
  // Loop the cards and build a structure with the name and subtitle.
  for (var i = 0; i < cards.length; i++) { 
    var card = cards[i];
    items.push({title: card.name, subtitle: getCostString(card)});
  }
  var sec = [{items: items}];
  var menu = new UI.Menu({sections: sec});
  // When the select button is pressed, 
  //open a new window with additional info, using the events item ID to lookup in array
  menu.on('select', function(e) {
    var hsCard = cards[e.item];
    var subtitle = getClass(hsCard.classs);
    if(subtitle !== "") subtitle += " ";
    subtitle += getRace(hsCard.race) + " " + getType(hsCard.type);
    var body = getCostString(hsCard) + ".\n" + hsCard.description;

    var card = new UI.Card({
      title: hsCard.name,
      subtitle: subtitle,
      body: body,
      scrollable: true,
      style: "small"
    });
    card.show();
  });
  
  menu.show();
},
function(error) {
  console.log('The API request failed: ' + error);
});