//Search URL = https://api.twitter.com/1.1/trends/place.json?id=23424977

let twitterTrends = [];

function getTrends() {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer AAAAAAAAAAAAAAAAAAAAABrCGgEAAAAAC1coVaNyGWQ0CGXKTsTV8e7f5eE%3DolLdFBbPmHPgkeJv97J8dXBKh6ZWTqVHKWci1jTRfGkM8AgR98"
  );
  myHeaders.append(
    "Cookie",
    'personalization_id="v1_QSZs3kHuqI6knlNtIbIchQ=="; guest_id=v1%3A159630901122767291'
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const url =
    "https://cors-anywhere-gp.herokuapp.com/https://api.twitter.com/1.1/trends/place.json?id=23424977";

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((responseJson) => topFive(responseJson))
    .catch((error) => console.log("error", error));
}

function topFive(responseJson) {
  for (let i = 0; i < 5; i++) {
    twitterTrends.push(responseJson[0].trends[i].name);
  }
  console.log(twitterTrends);
}

getTrends();
