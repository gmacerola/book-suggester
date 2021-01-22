let twitterTrends = [];
let topNews = [];
let numOfCompleted = 0;

//Gets Twitter trends Json and pushes them into topFive() function
//Had to send the twitter api to the cors-anywhere server I copied for this prroject due to lack of support
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

//Status of load is printed and pushes only the first 5 twitter trends to the twitterTrends array
//Sends the trend, without # to getNews() function
//After all 5 sent to getNews, showTrends() function runs to show the top 5 on the landing page
function topFive(responseJson) {
  $("#results").html("<h2>Loading Twitter Trends...</h2>");
  for (let i = 0; i < 5; i++) {
    $("#results").append(`<p>${responseJson[0].trends[i].name}</p>`);
    twitterTrends.push(responseJson[0].trends[i].name);
    setTimeout(
      () => getNews(responseJson[0].trends[i].name.replace("#", ""), i),
      2000
    );
  }
  showTrends();
}

//Grabs the top news from bing news for each twitter trend and funnels them to topNews array
function getNews(topic, index) {
  var requestOptions = {
    method: "GET",
  };

  var params = {
    api_token: "osDroSgfLIybDzrBaM59PSoRsfjn4k9tSoVMwXYb",
    search: { topic },
    limit: "5",
  };

  fetch(
    `https://api.thenewsapi.com/v1/news/all?api_token=osDroSgfLIybDzrBaM59PSoRsfjn4k9tSoVMwXYb&search=${topic}&limit=5&language=en`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      topNews[index] = result;
      checkNewsDone();
    })
    .catch((error) => console.log("error", error));
}

//Prints status of complete and also caps articles to 5
function checkNewsDone() {
  numOfCompleted++;
  $("#results").append(`<p>Loading ${numOfCompleted} of 5</p>`);
  if (numOfCompleted === 5) {
    renderData();
  }
}

//Adds section, name of trend, ul and then the li's consist of picture, art headline, and brief description
//Article headline is clickable and goes to a new tab in browser
//Adds button to refresh results if you want. This will rarely be used as trends dont change fast enough to give new results within a 30 min time
function renderData() {
  let html = "";
  for (let i = 0; i < twitterTrends.length; i++) {
    html += "<section class='news'>";
    html += `<h2>${twitterTrends[i]}</h2>`;
    html += "<ul class='articles'>";
    for (let j = 0; j < topNews[i].data.length; j++) {
      html += `<li>
        ${
          topNews[i].data[j].image_url
            ? `<div class="thumbnail" style="background-image:url('${topNews[i].data[j].image_url}')"></div>`
            : ""
        }
        <h3><a href="${topNews[i].data[j].url}" target="_blank">${
        topNews[i].data[j].title
      }</a></h3>
        <p>${topNews[i].data[j].snippet}</p>
      </li>`;
    }
    html += "</ul></section>";
  }
  html +=
    "<button type='button' class='js-restart button'>Refresh Results</button>";
  $("#results").html(html);
}

//Adds html to the landing page so you can see the trends prior to seeing the articles
//Allows users to walk away if they aren't interested in any of the trending topics
function showTrends() {
  let html = "";
  html += "<section class='twitter'>";
  html += "<ul class='trends'>";
  for (let i = 0; i < 5; i++) {
    html += `<li>${twitterTrends[i]}</li>`;
  }
  html += "</ul></section>";
  $(".topFiveTrends").html(html);
}

//Wipes out the html and resets blank values to arrays used so we can start fresh
//more often than not if clicked soon (within 10 mins) the refreshed page will look almost identical due to trends staying the same and news isn't printed that quickly usually
function getAgain() {
  $("#results").on("click", ".js-restart", function () {
    $("#results").html("");
    twitterTrends = [];
    topNews = [];
    numOfCompleted = 0;
    getTrends();
  });
}

//Looks for user to click initial button
//Due to time, I run the getTrends function prior to the click to it is pulling in the background and basically ready for the user when they click
function watchStart() {
  getTrends();
  $(".js-startButton").on("click", function (event) {
    $(".startPage").addClass("hidden");
    $(".topFiveTrends").addClass("hidden");
    $(".startButton").addClass("hidden");
    $("#results").removeClass("hidden");
  });
}

$(watchStart);
$(getAgain);
