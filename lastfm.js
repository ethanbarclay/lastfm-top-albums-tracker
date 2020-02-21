
// var userList = ["microsocks", "savethemanatee", "maxteryi83", "nia-bb"];

// Read file with list of users to array
function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var userList = httpGet('http://localhost:3000/backend').split(" ");

if (userList[0] == "") {
  throw new Error("No Users")
}

for (i = 0; i < userList.length; i++) {
  console.log(userList[i]);
}

function submitUser() {
  var user = document.getElementById("userText").value;
  // submit user to node server
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/backend", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("user=" + user);
  // reload page
  // location.reload(); 
}

var lastfm = new LastFM({
  apiKey: "473a07fbed21159d6a2eb70948df5a34"
});

var topAlbums = [];
var usersParsed = 0;

function addUserAlbums(username) {
  lastfm.user.getTopAlbums(
    { user: username, period: "7day" },
    {
      success: function(data) {
        // Add top 25 albums to topAlbums array
        for (i = 0; i < 25; i++) {
          var duplicate = false;
          // Test if no albums exist
          if (data.topalbums.album.length == 0) {
            return;
          }
          // Store album data in object
          var currentAlbum = new Album();
          currentAlbum.name = data.topalbums.album[i].name;
          currentAlbum.scrobbles = data.topalbums.album[i].playcount;
          currentAlbum.listeners = 1;
          // Check if album exists already
          if (topAlbums.length != 0) {
            for (n = 0; n < topAlbums.length; n++) {
              if (topAlbums[n].name == currentAlbum.name) {
                duplicate = true;
                topAlbums[n].scrobbles =
                  parseInt(topAlbums[n].scrobbles) +
                  parseInt(currentAlbum.scrobbles);
                topAlbums[n].listeners++;
              }
            }
          }
          // If not, add it to list
          if (!duplicate) {
            topAlbums.push(currentAlbum);
          }
        }
        usersParsed++;
        if (usersParsed == userList.length) {
          sort();
        }
      },
      error: function(code, message) {}
    }
  );
}

class Album {
  constructor(name, scrobbles, listeners) {
    this.name = name;
    this.scrobbles = scrobbles;
    this.listeners = listeners;
  }
}

// Add each user's albums to list
for (i = 0; i < userList.length; i++) {
  addUserAlbums(userList[i]);
}

// Sort list into toplist
function sort() {
  topAlbums.sort(function(a, b) {
    return b.scrobbles - a.scrobbles;
  });
  // Also remove albums with less than 2 listeners
  // for (i = 0; i < topAlbums.length; i++) {
  //   if (topAlbums[i].listeners < 2) {
  //     topAlbums.splice(i, 1);
  //   }
  // }
  output();
}

// Output toplist to html
function output() {
  for (i = 0; i < 10; i++) {
    var nameElement = document.getElementById((i + 1).toString());
    nameElement.innerHTML = topAlbums[i].name;
    var scrobbleElement = document.getElementById((i + 1).toString() + -2);
    scrobbleElement.innerHTML = topAlbums[i].scrobbles;
  }
}
