function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var url = tabs[0].url;

    if (url.indexOf('wikipedia.org') > -1) {
      callback(url);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  var $container = $("#container");
  chrome.storage.local.clear();
  $container.html("");

  getCurrentTabUrl((url) => {
    function checkResult(r) {
      if (r.url.indexOf("wikipedia.org") >= 20) { return false }
      if (r.url.indexOf("wikipedia.org") <= -1) { return false }
      if (r.url == url) { return false }
      if (r.url == "https://en.wikipedia.org/wiki/Main_Page") { return false }
      return true;
    }

    function updateResults(results) {
      var html = "";
      results.pages.forEach((p) => {
        html = html + "<div><a href='" + p.url + "'>" + p.title + "</a></div>";
      });
      $container.html(html);
    }

    var query = {
      text: "wikipedia"
    };
    chrome.history.search(query, (results) => {
      var filtered = results.filter(checkResult);
      var articles = filtered.map(r => {
        return r.url.split("/")[4];
      }).filter((u) => {
        return u;
      }).join(",");
      $.getJSON("http://localhost:8080/multigraph/" + articles, (results) => {
        updateResults(results);
      });
    });
  });

  $(document).on("click", "#container a", function() {
    console.log(this.target);
    chrome.tabs.update({
      url: this.href
    });
  });
});
