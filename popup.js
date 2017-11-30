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

  getCurrentTabUrl((url) => {
    function checkResult(r) {
      if (r.url.indexOf("wikipedia.org") >= 20) { return false }
      if (r.url.indexOf("wikipedia.org") <= -1) { return false }
      if (r.url == url) { return false }
      if (r.url == "https://en.wikipedia.org/wiki/Main_Page") { return false }
      return true;
    }

    var query = {
      text: "wikipedia"
    };
    chrome.history.search(query, (results) => {
      var filtered = results.filter(checkResult);
      var html = "";
      filtered.sort((a, b) => {
        if (a.visitedAt < b.visitedAt) { return -1 }
        if (a.visitedAt > b.visitedAt) { return 1  }

        return 0;
      }).forEach(r => {
        html = html + "<div><a href='" + r.url + "'>" + r.title + "</a></div>";
      });
      $container.html(html);
      console.log(filtered);
    });
  });

  $(document).on("click", "#container a", function() {
    console.log(this.target);
    chrome.tabs.update({
      url: this.href
    });
  });
});
